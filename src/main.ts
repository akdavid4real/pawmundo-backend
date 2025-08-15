import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  app.enableCors();
  app.setGlobalPrefix('api/v1');
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`PawPromise Backend running on port ${port}`, 'Bootstrap');
}
bootstrap();