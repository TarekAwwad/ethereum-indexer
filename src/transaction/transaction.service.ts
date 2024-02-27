import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { ConfigService } from 'src/config/config.service';

const { Web3 } = require('web3');

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);
  private provider: any;
  private web3: any;

  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private configService: ConfigService,
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

  createTransaction(createTransactionDto: CreateTransactionDto) {
    const transaction = new Transaction();
    transaction.hash = createTransactionDto.hash;
    transaction.block_height = createTransactionDto.block_height;
    transaction.sender_address = createTransactionDto.sender_address;
    transaction.status = createTransactionDto.status;
    transaction.isCHZ = false;
    return this.transactionRepository.save(transaction);
  }

  findAllTransaction() {
    return this.transactionRepository.find();
  }

  async findTransactionIsCHZ(hash: string) {
    const transaction = await this.findOneTransactionByHashFromDB(hash);
    
    if (transaction  !== null) {
      return transaction.isCHZ;
    }
    return (await this.findOneTransactionFromAPI(hash)).isCHZ;
  }

  findOneTransactionByHashFromDB(hash: string): Promise<Transaction> {
    Logger.log('Finding transaction by hash from DB: ' + hash);
    return this.transactionRepository.findOneBy({ hash });
  }

  async findOneTransactionFromAPI(hash: string): Promise<Transaction> {
    Logger.log('Finding transaction by hash from API: ' + hash);
    const transaction = new Transaction();

    return this.web3.eth.getTransaction(hash).then((txData: any) => {
      transaction.hash = txData.hash;
      transaction.block_height = txData.blockNumber;
      transaction.sender_address = txData.from;
      transaction.status = 'completed';
      transaction.isCHZ =
        txData.to ===
        this.configService.get('CHZ_CONTRACT_ADDRESS').toLowerCase();
      return transaction;
    });
  }

  getPendingTransactions(limit: number = 250) {
    return this.transactionRepository.find({
      where: { status: 'pending' },
      take: limit,
    });
  }

  updateTransaction(
    id: number,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    const transaction = new Transaction();
    transaction.hash = updateTransactionDto.hash;
    transaction.block_height = updateTransactionDto.block_height;
    transaction.sender_address = updateTransactionDto.sender_address;
    transaction.status = updateTransactionDto.status;
    transaction.isCHZ = updateTransactionDto.isCHZ;
    transaction.id = id;
    return this.transactionRepository.save(transaction);
  }

  removeTransaction(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
