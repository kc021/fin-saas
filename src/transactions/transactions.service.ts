import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) { }

  create(createTransactionDto: CreateTransactionDto, tenantId: string) {
    return this.prisma.transaction.create({
      data: {
        ...createTransactionDto,
        tenantId, // Vincula automaticamente à empresa do usuário
      },
    });
  }

  findAll(tenantId: string) {
    return this.prisma.transaction.findMany({
      where: { tenantId }, // SÓ traz dados da empresa logada
      orderBy: { date: 'desc' }, // Ordena por data (mais recente primeiro)
    });
  }

  async findOne(id: string, tenantId: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, tenantId }, // Garante que o ID pertence à empresa certa
    });

    if (!transaction) {
      throw new NotFoundException('Transação não encontrada');
    }

    return transaction;
  }

  update(id: string, updateTransactionDto: UpdateTransactionDto, tenantId: string) {
    // O updateMany garante que só atualiza se o tenantId bater
    return this.prisma.transaction.updateMany({
      where: { id, tenantId },
      data: updateTransactionDto,
    });
  }

  remove(id: string, tenantId: string) {
    return this.prisma.transaction.deleteMany({
      where: { id, tenantId },
    });
  }
}