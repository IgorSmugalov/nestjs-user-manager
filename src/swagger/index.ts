import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { REFRESH_COOKIE_KEY } from 'src/auth/auth.const';

export function buildSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .addCookieAuth(REFRESH_COOKIE_KEY, {
      description: 'HTTP ONLY COOKIE',
      type: 'apiKey',
    })
    .addBearerAuth()
    .setTitle('Nest API')
    .setDescription('Nest API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
