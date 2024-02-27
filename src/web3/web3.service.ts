import { Injectable, Logger } from '@nestjs/common';
import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { TransactionService } from 'src/transaction/transaction.service';
import { BlockService } from 'src/block/block.service';
import { Block } from 'src/block/entities/block.entity';
import { ConfigService } from 'src/config/config.service';
import { RunConfigService } from 'src/run-config/run-config.service';

const { Web3 } = require('web3');

@Injectable()
export class Web3Service implements OnModuleInit, OnModuleDestroy {
  private provider: any;
  private web3: any;

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

    this.web3 = new Web3(this.provider);
  }

  onModuleInit() {
    this.fetchPastBlocks();
    this.listenToNewBlocks();
  }

  onModuleDestroy() {
    this.provider.disconnect();
  }

  private async fetchPastBlocks() {
    let startBlock = +this.configService.get('START_BLOCK');
    let endBlock = await this.web3.eth.getBlockNumber();

    console.log('Fetching past blocks from ' + startBlock + ' to ' + endBlock);
    for (let i = startBlock; i <= endBlock; i++) {
      Logger.log('Fetching block ' + i);
      // check if block exists in db
      let block = (await this.blockService.getBlockByHeight(i));
      if (block) {
        Logger.log('Block ' + i + ' already exists in db.');
        continue;
      }

      this.web3.eth.getBlock(i).then((block: any) => {
        let b = new Block();

        b.height = block.number;
        b.hash = block.hash.slice(2);
        this.blockService.createBlock(b);

        block.transactions.forEach((tx: any) => {
          let t = new Transaction();
          t.hash = tx;
          t.block_height = block.number;
          t.status = 'pending';

          this.transactionService.createTransaction(t);
        });

        Logger.log(
          `Block: ${block.number} with ${block.transactions.length} transactions fetched.`,
        );
      });
      // Cool down for 1 second to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

  }

  private async listenToNewBlocks() {
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

    // If we want to listen to only chz specific events, we can use web3.eth.subscribe('logs', { address: '0x123...' })
    // For now, we are indexing all new blocks. We filter out chz transactions in the task service.
    (await this.web3.eth.subscribe('newBlockHeaders')).on('data', (block: any) => {
      this.web3.eth.getBlock(block.number).then((currentBlock: any) => {
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
