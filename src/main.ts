import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as requestIp from 'request-ip';

const whitelist = ['http://localhost:3000'];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: (requestOrigin, callback) => {
      if (whitelist.indexOf(requestOrigin) !== -1) callback(null, true);
      else callback(new Error('CORS error'));
    },
    methods: '*',
  });
  const config = new DocumentBuilder().setTitle('File store').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  app.use(requestIp.mw());
  await app.listen(process.env.PORT || 8080);
}
bootstrap();
