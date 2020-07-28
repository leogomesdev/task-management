import { NestFactory } from '@nestjs/core';
import { Logger, INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger: Logger = new Logger('bootstrap');
  const app: INestApplication = await NestFactory.create(AppModule);
  const port = 3000;
  await app.listen(port);
  logger.log(`Application is running on port ${port}`);
}
bootstrap();
