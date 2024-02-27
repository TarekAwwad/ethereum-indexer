import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TransactionModule } from '../transaction/transaction.module';
import { ConfigModule } from '../config/config.module';
import { RunConfigModule } from 'src/run-config/run-config.module';

@Module({
  imports: [
    TransactionModule,
    RunConfigModule,
    ConfigModule.register({ folder: './config' }),
  ],
  providers: [TasksService],
})
export class TasksModule {}
