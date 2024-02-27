import { Injectable, Logger } from '@nestjs/common';
import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { TransactionService } from 'src/transaction/transaction.service';
import { BlockService } from 'src/block/block.service';
import { Block } from 'src/block/entities/block.entity';
import { ConfigService } from 'src/config/config.service';
import { RunConfigService } from 'src/run-config/run-config.service';
import e from 'express';

const { Web3 } = require('web3');

@Injectable()
export class Web3Service implements OnModuleInit, OnModuleDestroy {
  private provider: any;

  constructor(
    private transactionService: TransactionService,
    private blockService: BlockService,
    private configService: ConfigService,
    private runConfigService: RunConfigService,
  ) {
    const options = {
      timeout: 30000, // ms

      clientConfig: {
        // Useful to keep a connection alive
        keepalive: true,
        keepaliveInterval: 30000, // ms
      },

      // Enable auto reconnection
      reconnect: {
        auto: true,
        delay: 1000, // ms
        maxAttempts: 10,
        onTimeout: true,
      },
    };

    Logger.log('Connecting to Alchemy websocket...');

    this.provider = new Web3.providers.WebsocketProvider(
      'wss://eth-mainnet.g.alchemy.com/v2/' +
        configService.get('ALCHEMY_API_KEY'),
      options,
    );
  }

  onModuleInit() {
    this.listenToEvents();
  }

  onModuleDestroy() {
    this.provider.disconnect();
  }

  private async listenToEvents() {
    this.provider.on('connect', () => {
      Logger.log('Websocket connected.');
    });
    this.provider.on('close', (event) => {
      Logger.log(event);
      Logger.log('Websocket closed.');
    });
    this.provider.on('error', (error) => {
      console.error(error);
    });

    const web3 = new Web3(this.provider);

    // If we want to listen to only chz specific events, we can use web3.eth.subscribe('logs', { address: '0x123...' })
    // For now, we are listening to all new blocks. We filter out chz transactions in the task service.
    (await web3.eth.subscribe('newBlockHeaders')).on('data', (block: any) => {
      web3.eth.getBlock(block.number).then((currentBlock: any) => {
        let b = new Block();

        b.height = currentBlock.number;
        b.hash = currentBlock.hash.slice(2);
        this.blockService.createBlock(b);

        currentBlock.transactions.forEach((tx: any) => {
          let t = new Transaction();
          t.hash = tx;
          t.block_height = currentBlock.number;
          t.status = 'pending';

          this.transactionService.createTransaction(t);
        });
        Logger.log(
          `New block: ${currentBlock.number} with ${currentBlock.transactions.length} transactions fetched.`,
        );

        // update block height in run config
        this.runConfigService.updateLastFetchedBlockHeight(currentBlock.number);
      });
    });
  }
}
