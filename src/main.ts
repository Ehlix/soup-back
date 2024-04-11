import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('port');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.use(cookieParser());

  app.enableCors({
    credentials: true,
    origin: configService.get('corsOrigin'),
  });

  await app.listen(port, () => {
    console.log(`Start on http://localhost:${port}`);
  });
}
bootstrap();
