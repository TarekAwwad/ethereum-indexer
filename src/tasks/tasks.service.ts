import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TransactionService } from 'src/transaction/transaction.service';
import { ConfigService } from 'src/config/config.service';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { RunConfigService } from 'src/run-config/run-config.service';
import { Block } from 'src/block/entities/block.entity';
import { BlockService } from 'src/block/block.service';

const { Web3 } = require('web3');
const abiDecoder = require('abi-decoder');
abiDecoder.addABI(require('../../abis/erc20.json'));

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
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

      // enable retries
      retry: {
        auto: true,
        delay: 1000,
        maxAttempts: 10,
        onTimeout: true,
      },
    };

    Logger.log('Connecting to Alchemy websocket...');
    this.provider = new Web3.providers.HttpProvider(
      'https://eth-mainnet.g.alchemy.com/v2/' +
        this.configService.get('ALCHEMY_API_KEY'),
      options,
    );

    this.web3 = new Web3(this.provider);
  }

  // TODO: Implement retry logic for fetching transactions
  private async fetchTRansactions() {
    let pendingTxs = await this.transactionService.getPendingTransactions(
      +this.configService.get('TRANSACTION_LIMIT_PER_TASK'),
    );

    Logger.log(
      'Processing ' + pendingTxs.length + ' pending transactions from DB.',
    );

    let total = 0;
    const chzContract = this.configService.get('CHZ_CONTRACT_ADDRESS');

    Logger.log('CHZ Contract: ' + chzContract);

    if (pendingTxs.length > 0) {
      pendingTxs.forEach((tx: Transaction) => {
        this.web3.eth.getTransaction(tx.hash).then((txData: any) => {
          if (txData.blockNumber) {
            tx.status = 'completed';
            tx.sender_address = txData.from;
            tx.block_height = txData.blockNumber;
            tx.isCHZ = txData.to === chzContract.toLowerCase() ? true : false;

            if (tx.isCHZ) {
              let decoded = abiDecoder.decodeMethod(txData.input);

              if (decoded.name === 'transfer') {
                total += +decoded.params[1].value;
              }
            }

            this.transactionService.updateTransaction(tx.id, tx);
            this.runConfigService.updateTotalTransfers(total.toString());
          }
        });
      });
    }
  }

  // TODO: Rewrite this to read CRON schedule from the config: replace decorator with a method.
  @Cron('15 * * * * *')
  handleCron() {
    this.fetchTRansactions();
  }
}
