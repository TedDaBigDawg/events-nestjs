import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe( { whitelist: true }));
  app.use(cookieParser());

  app.use(helmet());

  // Serve static files
  app.useStaticAssets(join(__dirname, '..', 'src', 'storage'), {
    prefix: '/assets', // Static assets will be accessible via '/assets'
  });

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:3001', 'https://isceauth.onrender.com', 'https://eventnest-slbg.onrender.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });


  // Global validation pipe for request validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove properties not defined in the DTO
      forbidNonWhitelisted: true, // Throw an error for unexpected properties
      transform: true, // Transform payloads to DTO instances
    }),
  );
  
  const config = new DocumentBuilder()
    .setTitle('ISCE EVENTS DOCUMENTATION')
    .setDescription('Swagger documentation for Isce Events')
    .setVersion('5.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token', // This is a key you can reference later
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Keeps the token across routes
    },
  });
  
  await app.listen(5550);
}
bootstrap();
