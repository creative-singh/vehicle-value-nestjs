import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const cookieSession = require("cookie-session");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieSession({
    keys: ["secret-it-is"]
  }))
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,   // For security concern
    })
  );

  await app.listen(3000);
}
bootstrap();
