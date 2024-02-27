import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RunConfigService } from './run-config.service';

@Controller('run-config')
export class RunConfigController {
  constructor(private readonly runConfigService: RunConfigService) {}

  @Get(':total')
  findOne() {
    return this.runConfigService.findOneConfig('total_transfers');
  }
}
