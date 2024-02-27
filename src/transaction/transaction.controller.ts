import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findTransactionIsCHZ(id);
  }
}
