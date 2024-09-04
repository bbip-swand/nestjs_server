import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { typeOrmConfig } from './config/ormconfig';
import { JwtAuthGuard } from './utils/guards/jwt-auth.guard';
import { TransactionCoreModule } from './transaction-core/transaction-core.module';
import { StudyCreateModule } from './study-create/study-create.module';
<<<<<<< HEAD
import { AwsS3Module } from './aws-s3/aws-s3.module';
=======
import { FirebaseModule } from './firebase/firebase.module';
>>>>>>> origin/fcm

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
<<<<<<< HEAD
    AwsS3Module,
=======
    FirebaseModule,
>>>>>>> origin/fcm
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
