import { IsNotEmpty, IsNumber, IsOptional, IsString, IsDateString, IsUUID, IsEnum } from 'class-validator';

export enum TransactionType {
    INCOME = 'INCOME',
    EXPENSE = 'EXPENSE',
}

export class CreateTransactionDto {
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsEnum(TransactionType)
    @IsNotEmpty()
    type: TransactionType;

    @IsDateString()
    @IsNotEmpty()
    dueDate: string;

    @IsDateString()
    @IsOptional()
    payDate?: string;

    @IsUUID()
    @IsNotEmpty()
    tenantId: string;

    @IsUUID()
    @IsNotEmpty()
    accountId: string;

    @IsUUID()
    @IsOptional()
    categoryId?: string;
}
