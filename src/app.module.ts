import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // <--- Importante
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from './transactions/transactions.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AccountsModule } from './accounts/accounts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // <--- Importante
    TransactionsModule,
    PrismaModule,
    AuthModule,
    AccountsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
