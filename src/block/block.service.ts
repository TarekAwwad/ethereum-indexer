import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBlockDto } from './dto/create-block.dto';
import { Repository } from 'typeorm';
import { Block } from './entities/block.entity';

@Injectable()
export class BlockService {
  constructor(
    @InjectRepository(Block)
    private blockRepository: Repository<Block>,
  ) {}

  createBlock(createBlockDto: CreateBlockDto) {
    let block = new Block();

    block.height = createBlockDto.height;
    block.hash = createBlockDto.hash;

    return this.blockRepository.save(block);
  }
}
