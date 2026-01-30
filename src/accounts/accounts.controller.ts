import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt')) // Cadeado Geral
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) { }

  @Post()
  create(@Body() createAccountDto: CreateAccountDto, @Req() req) {
    return this.accountsService.create(createAccountDto, req.user.tenantId);
  }

  @Get()
  findAll(@Req() req) {
    return this.accountsService.findAll(req.user.tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.accountsService.findOne(id, req.user.tenantId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto, @Req() req) {
    return this.accountsService.update(id, updateAccountDto, req.user.tenantId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.accountsService.remove(id, req.user.tenantId);
  }
}
