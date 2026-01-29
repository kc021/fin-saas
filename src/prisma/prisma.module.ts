import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // <--- Deixa o banco disponível para o app todo
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // <--- OBRIGATÓRIO: Permite que outros módulos usem o banco
})
export class PrismaModule { }