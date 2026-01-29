import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    // ROTA DE LOGIN
    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        // 1. Busca o usuário
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        // 2. Verifica a senha
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        // 3. Gera o Token
        return this.generateToken(user.id, user.email);
    }

    // ROTA DE REGISTRO (Cria User + Tenant + Vincula)
    async register(registerDto: RegisterDto) {
        const { email, password, name, companyName } = registerDto;

        // 1. Verifica se já existe
        const userExists = await this.prisma.user.findUnique({
            where: { email },
        });

        if (userExists) {
            throw new ConflictException('E-mail já está em uso');
        }

        // 2. Criptografa a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Transação: Cria User e Tenant juntos (se um falhar, tudo falha)
        const result = await this.prisma.$transaction(async (prisma) => {
            // Cria o Usuário
            const user = await prisma.user.create({
                data: {
                    email,
                    name,
                    password: hashedPassword,
                },
            });

            // Cria a Empresa (Tenant)
            const tenant = await prisma.tenant.create({
                data: {
                    name: companyName,
                    users: {
                        create: {
                            userId: user.id,
                            role: 'OWNER',
                        },
                    },
                },
            });

            return { user, tenant };
        });

        // 4. Retorna o token direto para ele já logar
        return this.generateToken(result.user.id, result.user.email);
    }

    // Função auxiliar para gerar o JWT
    private generateToken(userId: string, email: string) {
        const payload = { sub: userId, email };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}