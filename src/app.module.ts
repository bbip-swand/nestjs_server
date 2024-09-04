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
import { StudyCreateModule } from './study-create/study-create.module';
import { TransactionCoreModule } from './transaction-core/transaction-core.module';
import { JwtAuthGuard } from './utils/guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    AuthModule,
    TransactionCoreModule,
    StudyCreateModule,
    AwsS3Module,
    FirebaseModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
