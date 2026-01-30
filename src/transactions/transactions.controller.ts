import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) { }

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto, @Req() req) {
    // Pega o ID da empresa do token e manda pro serviço
    return this.transactionsService.create(createTransactionDto, req.user.tenantId);
  }

  @Get()
  findAll(@Req() req) {
    return this.transactionsService.findAll(req.user.tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.transactionsService.findOne(id, req.user.tenantId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto, @Req() req) {
    return this.transactionsService.update(id, updateTransactionDto, req.user.tenantId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.transactionsService.remove(id, req.user.tenantId);
  }
}