import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : ['log', 'error', 'warn', 'debug', 'verbose']
  });
  
  // Global exception filter for detailed error messages
  app.useGlobalFilters(new GlobalExceptionFilter());
  
  // Enhanced validation pipe with detailed error messages
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    exceptionFactory: (errors) => {
      const result = errors.map((error) => ({
        property: error.property,
        value: error.value,
        constraints: error.constraints,
        suggestions: [
          `Check the '${error.property}' field format and requirements`,
          'Refer to the API documentation for correct data types',
        ],
      }));
      return {
        message: 'Validation failed for the provided data',
        statusCode: 400,
        details: result,
        suggestions: [
          'Review all field requirements in the API documentation',
          'Ensure all required fields are provided with correct data types',
        ],
      };
    },
  }));
  
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });
  
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Setup Swagger - always enabled in development, conditional in production
  const shouldEnableSwagger = process.env.NODE_ENV !== 'production' || process.env.ENABLE_SWAGGER === 'true';
  
  if (shouldEnableSwagger) {
    const config = new DocumentBuilder()
      .setTitle('🐾 PawPromise API')
      .setDescription(`
        ## Comprehensive Pet Management Platform
        
        **PawPromise** is a modern pet management platform that helps pet owners:
        - Track their pets' health and wellness
        - Schedule appointments and manage medical records
        - Log daily activities and diet
        - Manage medications and vaccinations
        - Connect with veterinarians
        
        ### 🔐 Authentication
        Most endpoints require JWT authentication. Use the **Authorize** button to set your Bearer token.
        
        ### 📱 Features
        - **Pet Management**: Complete pet profiles with detailed information
        - **Health Tracking**: Medical records, medications, vaccinations
        - **Activity Logging**: Daily walks, feeding, exercise tracking
        - **Appointment System**: Vet appointment scheduling
        - **Insurance Management**: Pet insurance policies and claims
        - **Reminders**: Automated health and medication reminders
        
        ### 🚨 Error Handling
        All endpoints return detailed error messages with:
        - Clear error descriptions
        - Validation details
        - Suggested solutions
        - HTTP status codes
      `)
      .setVersion('2.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth'
      )
      .addServer(process.env.BASE_URL || 'http://localhost:3000', 'Development Server')
      .addServer('https://pawpromise-backend.onrender.com', 'Production Server')
      .addTag('Authentication', 'User registration, login, and account management')
      .addTag('Pets', 'Pet profile management and detailed information')
      .addTag('Activity Tracking', 'Daily activity and diet logging')
      .addTag('Health Records', 'Medical history and health tracking')
      .addTag('Medications', 'Medication management and reminders')
      .addTag('Appointments', 'Veterinary appointment scheduling')
      .addTag('Insurance', 'Pet insurance policies and claims')
      .addTag('Health Reminders', 'Automated health notifications')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
      customSiteTitle: '🐾 PawPromise API Documentation',
      customfavIcon: '/favicon.ico',
      customCss: `
        .topbar-wrapper .link { content: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjRkY2QjM1Ii8+Cjwvc3ZnPgo='); }
        .swagger-ui .topbar { background-color: #1f2937; }
        .swagger-ui .info .title { color: #f59e0b; }
      `,
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
      },
    });
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