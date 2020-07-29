import { NestFactory } from '@nestjs/core';
import { Logger, INestApplication } from '@nestjs/common';
import * as config from 'config';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger: Logger = new Logger('bootstrap');
  const serverConfig = config.get('server');

  const app: INestApplication = await NestFactory.create(AppModule);

  app.enableCors({ origin: serverConfig.origin });
  logger.log(`Accepting requests from origin ${serverConfig.origin}`);

  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
  logger.log(`Application is running on port ${port}`);
}
bootstrap();
