import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, TransactionType } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) { }

  create(createTransactionDto: CreateTransactionDto) {
    const { amount, dueDate, payDate, type, ...rest } = createTransactionDto;

    return this.prisma.transaction.create({
      data: {
        ...rest,
        amount: new Prisma.Decimal(amount),
        dueDate: new Date(dueDate),
        payDate: payDate ? new Date(payDate) : null,
        type: type as TransactionType,
      },
    });
  }

  findAll() {
    return this.prisma.transaction.findMany();
  }

  findOne(id: string) {
    return this.prisma.transaction.findUnique({
      where: { id },
    });
  }

  update(id: string, updateTransactionDto: UpdateTransactionDto) {
    const { amount, dueDate, payDate, type, ...rest } = updateTransactionDto;
    const data: any = { ...rest };

    if (amount !== undefined) {
      data.amount = new Prisma.Decimal(amount);
    }
    if (dueDate !== undefined) {
      data.dueDate = new Date(dueDate);
    }
    if (payDate !== undefined) {
      data.payDate = new Date(payDate);
    }
    if (type !== undefined) {
      data.type = type as TransactionType;
    }

    return this.prisma.transaction.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.transaction.delete({
      where: { id },
    });
  }
}