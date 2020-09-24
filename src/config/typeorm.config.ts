import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const TypeOrmConfig: TypeOrmModuleOptions = {
  type: (process.env.DB_TYPE as any) || 'postgres',
  host: process.env.RDS_HOSTNAME || '10.12.0.3',
  port: Number(process.env.RDS_PORT) || 5432,
  database: process.env.RDS_DB_NAME || 'nestjstasks',
  username: process.env.RDS_USERNAME || 'nestjstasks',
  password: process.env.RDS_PASSWORD || 'a8X0zDLr6B2q',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: ((process.env.TYPEORM_SYNC as unknown) as boolean) || true,
};
