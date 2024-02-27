import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Transaction } from './transaction/entities/transaction.entity';
import { TasksModule } from './tasks/tasks.module';
import { TransactionModule } from './transaction/transaction.module';
import { Web3Module } from './web3/web3.module';
import { BlockModule } from './block/block.module';
import { Block } from './block/entities/block.entity';
import { RunConfig } from './run-config/entities/run-config.entity';
import { ConfigModule } from './config/config.module';
import { RunConfigModule } from './run-config/run-config.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TasksModule,
    Web3Module,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'secret',
      username: 'ethuser',
      database: 'ethindexer',
      entities: [Transaction, Block, RunConfig],
      synchronize: true,
      logging: false,
    }),
    TransactionModule,
    BlockModule,
    RunConfigModule,
    ConfigModule.register({ folder: './config' }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
