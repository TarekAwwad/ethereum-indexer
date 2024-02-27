import { Module } from '@nestjs/common';
import { BlockService } from './block.service';
import { Block } from './entities/block.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Block])],
  providers: [BlockService],
  exports: [BlockService],
})
export class BlockModule {}
