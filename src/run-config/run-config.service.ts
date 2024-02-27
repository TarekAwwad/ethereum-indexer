import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RunConfig } from './entities/run-config.entity';
import { CreateRunConfigDto } from './dto/create-run-config.dto';
import { UpdateRunConfigDto } from './dto/update-run-config.dto';

@Injectable()
export class RunConfigService {
  constructor(
    @InjectRepository(RunConfig)
    private RunConfigRepository: Repository<RunConfig>,
  ) {}

  createConfig(createConfigDto: CreateRunConfigDto) {
    return 'This action adds a new config';
  }

  findOneConfig(key: string) {
    return this.RunConfigRepository.findOneBy({ key: key });
  }

  async getLatestBlockHeight() {
    return (await this.findOneConfig('last_fetched_block')).value;
  }

  updateConfig(key: string, updateConfigDto: UpdateRunConfigDto) {
    return this.RunConfigRepository.upsert(
      {
        key: key,
        value: updateConfigDto.value,
      },
      ['key'],
    );
  }

  updateLastFetchedBlockHeight(height: string) {
    Logger.log('Updating last fetched block height to ' + height);
    let updatedto = new UpdateRunConfigDto();
    updatedto.key = 'last_fetched_block';
    updatedto.value = height;

    this.updateConfig('last_fetched_block', updatedto);
  }

  updateTotalTransfers(totalTransfers: string) {
    Logger.log('Updating total transfers to ' + totalTransfers);
    let updatedto = new UpdateRunConfigDto();
    updatedto.key = 'total_transfers';
    updatedto.value = totalTransfers;

    this.updateConfig('total_transfers', updatedto);
  }
}
