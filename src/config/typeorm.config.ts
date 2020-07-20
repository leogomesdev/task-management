import { TypeOrmModuleOptions } from '@nestjs/typeorm';
export const TypeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: '10.12.0.3',
  port: 5432,
  username: 'nestjstasks',
  password: 'a8X0zDLr6B2q',
  database: 'nestjstasks',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true, //change to false in production
};
