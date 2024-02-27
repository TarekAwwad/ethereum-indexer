import { Module } from '@nestjs/common';
import { RunConfigService } from './run-config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RunConfig } from './entities/run-config.entity';
import { RunConfigController } from './run-config.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RunConfig])],
  controllers: [RunConfigController],
  providers: [RunConfigService],
  exports: [RunConfigService],
})
export class RunConfigModule {}
