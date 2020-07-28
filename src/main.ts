import { NestFactory } from '@nestjs/core';
import { Logger, INestApplication } from '@nestjs/common';
import * as config from 'config';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger: Logger = new Logger('bootstrap');
  const app: INestApplication = await NestFactory.create(AppModule);
  const port = process.env.PORT || config.get('server').port;
  await app.listen(port);
  logger.log(`Application is running on port ${port}`);
}
bootstrap();
