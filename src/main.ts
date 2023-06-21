import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { buildSwagger } from './swagger';
import { PrismaService } from './prisma/prisma.service';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  buildSwagger(app);
  // useContainer(app.select(AppModule), { fallback: true });
  await app.listen(3000);
}

bootstrap();
