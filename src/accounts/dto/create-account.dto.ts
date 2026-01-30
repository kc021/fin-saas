import { IsNotEmpty, IsEnum, IsOptional, IsNumber } from 'class-validator';

// Precisamos exportar o Enum para o Service usar também
export enum AccountType {
    CHECKING = 'CHECKING',
    CASH = 'CASH',
    SAVINGS = 'SAVINGS',
    CREDIT = 'CREDIT',
}

export class CreateAccountDto {
    @IsNotEmpty({ message: 'O nome da conta é obrigatório' })
    name: string;

    @IsEnum(AccountType, { message: 'Tipo de conta inválido' })
    @IsOptional()
    type?: AccountType;

    @IsNumber({}, { message: 'O saldo deve ser um número' })
    @IsOptional()
    initialBalance?: number;
}