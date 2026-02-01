import { IsNotEmpty, IsNumber, IsEnum, IsPositive, IsDateString, IsString, IsUUID, IsOptional } from 'class-validator';

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

  // 👇 CORREÇÃO AQUI: Mudamos de 'date' para 'dueDate' para bater com o banco
  @IsDateString({}, { message: 'Data de vencimento inválida' })
  dueDate: string;

  // Campo opcional para data de pagamento (se já foi pago)
  @IsOptional()
  @IsDateString({}, { message: 'Data de pagamento inválida' })
  payDate?: string;

  @IsString()
  @IsNotEmpty({ message: 'O ID da conta é obrigatório' })
  @IsUUID(undefined, { message: 'ID da conta inválido' })
  accountId: string;

  // Adicionando Categoria também, pois é útil
  @IsOptional()
  @IsUUID(undefined, { message: 'ID da categoria inválido' })
  categoryId?: string;
}