import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
    @IsNotEmpty({ message: 'O nome é obrigatório' })
    name: string;

    @IsEmail({}, { message: 'O e-mail informado é inválido' })
    email: string;

    @IsNotEmpty()
    @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
    password: string;

    @IsNotEmpty({ message: 'O nome da empresa é obrigatório' })
    companyName: string; // <--- Importante: Já cria o Tenant
}