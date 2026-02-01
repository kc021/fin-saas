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

    // 1. Busca o usuário E suas permissões (para saber a empresa)
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        memberships: true, // <--- Importante: Traz o vínculo com a empresa
      },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // 2. Verifica a senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // 3. Pega o ID da primeira empresa que o usuário é dono/membro
    // (Num sistema maior, o usuário escolheria qual empresa entrar)
    const tenantId = user.memberships[0]?.tenantId;

    if (!tenantId) {
      throw new UnauthorizedException('Usuário não pertence a nenhuma empresa');
    }

    // 4. Gera o Token COM o ID da empresa
    return this.generateToken(user.id, user.email, tenantId);
  }

  // ROTA DE REGISTRO
  async register(registerDto: RegisterDto) {
    const { email, password, name, companyName } = registerDto;

    const userExists = await this.prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new ConflictException('E-mail já está em uso');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
        },
      });

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

    // Gera o Token já com o ID da nova empresa
    return this.generateToken(result.user.id, result.user.email, result.tenant.id);
  }

  // ATUALIZADO: Agora aceita tenantId
  private generateToken(userId: string, email: string, tenantId: string) {
    const payload = {
      sub: userId,
      email,
      tenantId // <--- A peça que faltava!
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}