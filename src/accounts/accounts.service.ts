import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) { }

  create(createAccountDto: CreateAccountDto, tenantId: string) {
    return this.prisma.account.create({
      data: {
        name: createAccountDto.name,
        type: createAccountDto.type || 'CHECKING',
        initialBalance: createAccountDto.initialBalance || 0,
        tenantId, // Vincula à empresa
      },
    });
  }

  findAll(tenantId: string) {
    return this.prisma.account.findMany({
      where: { tenantId },
    });
  }

  async findOne(id: string, tenantId: string) {
    const account = await this.prisma.account.findFirst({
      where: { id, tenantId },
    });

    if (!account) {
      throw new NotFoundException('Conta não encontrada');
    }

    return account;
  }

  update(id: string, updateAccountDto: UpdateAccountDto, tenantId: string) {
    return this.prisma.account.updateMany({
      where: { id, tenantId },
      data: updateAccountDto,
    });
  }

  remove(id: string, tenantId: string) {
    return this.prisma.account.deleteMany({
      where: { id, tenantId },
    });
  }
}