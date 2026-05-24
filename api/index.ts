import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { GlobalExceptionFilter } from '../src/common/filters/global-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

let cachedApp: NestExpressApplication;

async function bootstrap(): Promise<NestExpressApplication> {
    if (cachedApp) return cachedApp;

    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: ['error', 'warn'],
    });

    app.useGlobalFilters(new GlobalExceptionFilter());

    app.use((req: any, _res: any, next: any) => {
        if (req.url?.startsWith('/api/auth/')) {
            req.url = req.url.replace(/^\/api\/auth\//, '/api/v1/auth/');
        }
        next();
    });

    app.setGlobalPrefix('api/v1');

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));

    // Add a root handler so Vercel doesn't return 404 on the base URL 
    const httpAdapter = app.getHttpAdapter();
    httpAdapter.get('/', (req, res: any) => {
        res.redirect('/api');
    });

    app.enableCors({
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    });

    // Swagger
    const config = new DocumentBuilder()
        .setTitle('🐾 PawPromise API')
        .setDescription('Comprehensive Pet Management Platform API')
        .setVersion('2.0.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
        customSiteTitle: '🐾 PawPromise API Documentation',
        customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
        customJs: [
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
        ],
        swaggerOptions: { persistAuthorization: true },
    });

    await app.init();
    cachedApp = app;
    return app;
}

export default async function handler(req: any, res: any) {
    const app = await bootstrap();
    const instance: any = app.getHttpAdapter().getInstance();
    return instance(req, res);
}
