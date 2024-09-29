import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AttendanceModule } from './attendance/attendance.module';
import { AuthModule } from './auth/auth.module';
import { AwsS3Module } from './aws-s3/aws-s3.module';
import { typeOrmConfig } from './config/ormconfig';
import { FirebaseModule } from './firebase/firebase.module';
import { PostingModule } from './posting/posting.module';
import { StudyModule } from './study/study.module';
import { TransactionCoreModule } from './transaction-core/transaction-core.module';
import { UsersModule } from './users/users.module';
import { JwtAuthGuard } from './utils/guards/jwt-auth.guard';
import { CalendarModule } from './calendar/calendar.module';
import { ArchiveModule } from './archive/archive.module';

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [isDev ? '.env.development' : '.env.production'],
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        db: configService.get('REDIS_DB'),
        ttl: configService.get('REDIS_DEFAULT_TTL'),
      }),
    }),
    AuthModule,
    UsersModule,
    TransactionCoreModule,
    StudyModule,
    AwsS3Module,
    FirebaseModule,
    AttendanceModule,
    CalendarModule,
    PostingModule,
    ArchiveModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
