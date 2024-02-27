import { Module } from '@nestjs/common';
import { Web3Service } from './web3.service';
import { TransactionModule } from 'src/transaction/transaction.module';
import { BlockModule } from 'src/block/block.module';
import { ConfigModule } from 'src/config/config.module';
import { RunConfigModule } from 'src/run-config/run-config.module';

@Module({
  imports: [
    TransactionModule,
    BlockModule,
    RunConfigModule,
    ConfigModule.register({ folder: './config' }),
  ],
  providers: [Web3Service],
})
export class Web3Module {}
