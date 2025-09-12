import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : ['log', 'error', 'warn', 'debug', 'verbose']
  });
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));
  
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });
  
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Setup Swagger based on environment variable
  if (process.env.ENABLE_SWAGGER === 'true') {
    const config = new DocumentBuilder()
      .setTitle('PawMundo API')
      .setDescription('The PawMundo API description')
      .setVersion('1.0')
      .addBearerAuth()
      .addServer(process.env.BASE_URL || 'http://localhost:3000')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }
  
  const port = parseInt(process.env.PORT || '3000', 10);
  await app.listen(port, '0.0.0.0');
  
  Logger.log(`PawMundo Backend running on port ${port}`, 'Bootstrap');
  if (process.env.ENABLE_SWAGGER === 'true') {
    const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;
    Logger.log(`Swagger documentation available at ${baseUrl}/api`, 'Bootstrap');
  }
}
bootstrap();