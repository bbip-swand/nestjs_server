import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AwsS3Module } from './aws-s3/aws-s3.module';
import { typeOrmConfig } from './config/ormconfig';
import { FirebaseModule } from './firebase/firebase.module';
import { StudyModule } from './study/study.module';
import { TransactionCoreModule } from './transaction-core/transaction-core.module';
import { JwtAuthGuard } from './utils/guards/jwt-auth.guard';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    AuthModule,
    TransactionCoreModule,
    StudyModule,
    AwsS3Module,
    FirebaseModule,
    AttendanceModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
