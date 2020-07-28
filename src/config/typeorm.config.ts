import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';

const databaseConfig = config.get('database');

export const TypeOrmConfig: TypeOrmModuleOptions = {
  type: process.env.DB_TYPE || databaseConfig.type,
  host: process.env.RDS_HOSTNAME || databaseConfig.host,
  port: process.env.RDS_PORT || databaseConfig.port,
  username: process.env.RDS_USERNAME || databaseConfig.username,
  password: process.env.RDS_PASSWORD || databaseConfig.password,
  database: process.env.RDS_DB_NAME || databaseConfig.databaseName,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: process.env.TYPEORM_SYNC || databaseConfig.synchronize,
};
