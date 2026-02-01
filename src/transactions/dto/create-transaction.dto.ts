import { IsNotEmpty, IsNumber, IsEnum, IsPositive, IsDateString, IsString, IsUUID } from 'class-validator';

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export class CreateTransactionDto {
  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  description: string;

  @IsNumber({}, { message: 'O valor deve ser um número' })
  @IsPositive({ message: 'O valor deve ser positivo' })
  amount: number;

  @IsEnum(TransactionType, { message: 'Tipo inválido (INCOME ou EXPENSE)' })
  type: TransactionType;

  @IsDateString({}, { message: 'Data inválida' })
  date: string;

  @IsString()
  @IsNotEmpty({ message: 'O ID da conta é obrigatório' })
  @IsUUID(undefined, { message: 'ID da conta inválido' })
  accountId: string;
}
