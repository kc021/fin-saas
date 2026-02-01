import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração CORS "Blindada"
  app.enableCors({
    origin: true, // Permite qualquer origem (Frontend, Postman, etc)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization', // Permite enviar o Token
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();