import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

console.log(process.env.CLIENT_URL);
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
      origin: process.env.CLIENT_URL,
      methods: '*',
    },
  });
  app.use(cookieParser());
  app.enableCors();
  const config = new DocumentBuilder().setTitle('File store').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  await app.listen(process.env.PORT || 8080);
}
bootstrap();
