import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { jwtConstants } from 'src/auth/constants';
import { StudyInfo } from 'src/models/study-info.entity';
import { StudyMember } from 'src/models/study-member.entity';
import { UserInfo } from 'src/models/user-info.entity';
import { User } from 'src/models/user.entity';
import { TransactionCoreModule } from 'src/transaction-core/transaction-core.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserInfo, StudyInfo, StudyMember]),
    forwardRef(() => AuthModule),
    forwardRef(() => TransactionCoreModule),
    JwtModule.register({
      secret: jwtConstants.secret,
    }),
    HttpModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
