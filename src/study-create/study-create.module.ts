import { forwardRef, Module } from '@nestjs/common';
import { StudyCreateService } from './study-create.service';
import { StudyCreateController } from './study-create.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyInfo } from 'src/models/study-info.entity';
import { WeeklyStudyContent } from 'src/models/weekly-study-content.entity';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { TransactionCoreModule } from 'src/transaction-core/transaction-core.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudyInfo, WeeklyStudyContent]),
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
    forwardRef(() => TransactionCoreModule),
    JwtModule.register({
      secret: jwtConstants.secret,
    }),
  ],
  controllers: [StudyCreateController],
  providers: [StudyCreateService],
  exports: [StudyCreateService],
})
export class StudyCreateModule {}
