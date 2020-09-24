import { NestFactory } from '@nestjs/core';
import { Logger, INestApplication } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import { AppModule } from './app.module';
import appConfig from './config/app.config';

async function bootstrap() {
  const logger: Logger = new Logger('bootstrap');

  const app: INestApplication = await NestFactory.create(AppModule);
  const origin: string = appConfig.origin;

  app.enableCors({ origin });
  logger.log(`Accepting requests from origin ${origin}`);

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(appConfig.port);
  logger.log(`Application is running on port ${appConfig.port}`);
}
bootstrap();
