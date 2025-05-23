import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
dotenv.config(
  isDev ? { path: '.env.development' } : { path: '.env.production' },
);

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'bbip-mysql.crs8mekg49iu.ap-northeast-2.rds.amazonaws.com',
  port: 3306,
  username: 'root',
  password: process.env.DB_PASSWORD,
  database: 'bbip_server',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  timezone: '+09:00',
  autoLoadEntities: true,
  synchronize: process.env.ORM_SYNC === 'true',
  migrationsTableName: 'migration_table',
  migrations: ['dist/src/migrations/*{.ts,.js}'],
};
