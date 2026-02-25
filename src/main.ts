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

  // Set global API prefix
  app.setGlobalPrefix('api/v1');

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
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Swagger — always enabled for easy API testing
  const config = new DocumentBuilder()
    .setTitle('🐾 PawPromise API')
    .setDescription(`
## Comprehensive Pet Management Platform

### 🧪 Quick-Start Testing Guide
1. **Register** → \`POST /auth/register\` with email, password (min 8 chars, needs uppercase + lowercase + number), firstName, lastName
2. **Copy the \`access_token\`** from the response
3. **Click "Authorize" 🔒** at the top → paste \`Bearer YOUR_TOKEN\` → click Authorize
4. Now all protected endpoints will work!

**Test Accounts:**
- Register as **user** (default role) — can create pets, book consultations, post in forum
- Register as **vet** (set \`role: "vet"\`) — can access vet queue, accept consultations

---

### 🔐 Authentication
Most endpoints require JWT authentication. Use the **Authorize** button above to set your Bearer token.
Token persists between page refreshes.

### 📱 API Modules
| Module | Description |
|--------|-------------|
| **Pets** | Full pet profiles with health tracking |
| **Consultations** | Video/audio/chat vet consultations |
| **Health Records** | Medical history and attachments |
| **Medications** | Medication schedules and reminders |
| **Activity Tracking** | Walks, feeding, exercise logging |
| **Forum** | Community posts, replies, likes |
| **Insurance** | Policies and claims management |
| **AI Chat** | AI-powered pet health assistant |
| **Symptom Checker** | AI symptom analysis |

### 🚨 Error Handling
All errors return: clear description, validation details, suggested solutions, and proper HTTP status codes.
    `)
    .setVersion('2.0.0')
    .addBearerAuth()
    .addServer(process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`, 'Server')
    .addTag('Authentication', 'Register, login, profile — start here!')
    .addTag('users', 'User profile management')
    .addTag('Pets', 'Pet CRUD, health status, species filtering')
    .addTag('Consultations', 'User↔Vet consultation workflow')
    .addTag('Activity Tracking', 'Walks, feeding, exercise, daily stats')
    .addTag('Health Records', 'Medical records, vaccinations, lab results')
    .addTag('Medications', 'Medication schedules and adherence')
    .addTag('Appointments', 'Vet appointment booking')
    .addTag('insurance', 'Pet insurance policies and claims')
    .addTag('forum', 'Community posts, replies, and likes')
    .addTag('notifications', 'User notification management')
    .addTag('events', 'Calendar events and reminders')
    .addTag('health-reminders', 'Automated vaccination reminders')
    .addTag('ai-chat', 'AI pet health chat assistant')
    .addTag('symptom-checker', 'AI-powered symptom analysis')
    .addTag('Seed', 'Database seeding for development')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: '🐾 PawPromise API — Test Console',
    customfavIcon: '/favicon.ico',
    customCss: `
      .topbar-wrapper .link { content: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjRkY2QjM1Ii8+Cjwvc3ZnPgo='); }
      .swagger-ui .topbar { background-color: #1f2937; }
      .swagger-ui .info .title { color: #f59e0b; }
      .swagger-ui .info .description { max-width: 900px; }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      docExpansion: 'list',
      tagsSorterAlpha: true,
      operationsSorter: 'method',
      tryItOutEnabled: true,
    },
  });

  const port = parseInt(process.env.PORT || '3000', 10);
  await app.listen(port, '0.0.0.0');

  const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;
  Logger.log(`🐾 PawMundo Backend running on port ${port}`, 'Bootstrap');
  Logger.log(`📖 Swagger API docs: ${baseUrl}/api`, 'Bootstrap');
  Logger.log(`📋 Swagger JSON: ${baseUrl}/api-json`, 'Bootstrap');
}
bootstrap();