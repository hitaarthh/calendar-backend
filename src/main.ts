import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionInterceptor } from './common/http-exception.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  // Exception interceptor
  app.useGlobalInterceptors(new HttpExceptionInterceptor());

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Calendar API')
    .setDescription('API for managing calendar events')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();
  await app.listen(3000);
}
bootstrap().catch(err => console.error('Bootstrap failed:', err));