import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
import { resolve } from 'path';
import * as express from 'express';

async function bootstrap() {
  console.log('🔍 ENV VARIABLES:', {
    NODE_ENV: process.env.NODE_ENV,
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_NAME: process.env.DB_NAME,
    UPLOAD_PATH: process.env.UPLOAD_PATH,
  });

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  app.enableCors({
    origin: ['http://localhost:4200', 'https://org-food-inky.vercel.app'],
    credentials: true,
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;

  const uploadPath = configService.get<string>('UPLOAD_PATH');
  if (!uploadPath) {
    throw new Error('UPLOAD_PATH must be defined in .env');
  }

  const resolvedPath = resolve(uploadPath);
  if (!fs.existsSync(resolvedPath)) {
    fs.mkdirSync(resolvedPath, { recursive: true });
  }

  app.use('/uploads', express.static(resolvedPath));

  const config = new DocumentBuilder()
    .setTitle('OrgFood API')
    .setDescription('API para OrgFood Empresas 1')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
}
bootstrap();
