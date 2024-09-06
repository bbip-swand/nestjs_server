import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'bbip-mysql.cl6q4k2cur5i.ap-northeast-2.rds.amazonaws.com',
  port: 3306,
  username: 'root',
  password: process.env.DB_PASSWORD,
  database: 'bbip_server',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: process.env.ORM_SYNC === 'true',
  migrationsTableName: 'migration_table',
  migrations: ['dist/src/migrations/*{.ts,.js}'],
};
