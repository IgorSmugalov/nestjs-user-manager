import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { buildSwagger } from './swagger';
import { PrismaService } from './prisma/prisma.service';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  app.useStaticAssets(join(__dirname, '../assets'), {
    prefix: '/assets',
  });
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  buildSwagger(app);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(3000);
}

bootstrap();
