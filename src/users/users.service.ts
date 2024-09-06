import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
import * as jwt from 'jsonwebtoken';
import { lastValueFrom, map } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { UserInfo } from 'src/models/user-info.entity';
import { User } from 'src/models/user.entity';
import { TransactionCoreService } from 'src/transaction-core/transaction-core.service';
import { Repository } from 'typeorm';
import { AppleSignupRequestDto } from './dto/apple-signup-request.dto';
import { userInfoRequestDto } from './dto/user-info-request.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserInfo)
    private userInfoRepository: Repository<UserInfo>,
    private authService: AuthService,
    private jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly transactionCoreService: TransactionCoreService,
  ) {}

  createAppleClientSecret(): string {
    const header = {
      alg: 'ES256',
      kid: this.configService.get('APPLE_KEY_ID'),
    };
    const payload = {
      iss: this.configService.get('APPLE_TEAM_ID'),
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 15777000, // 6달
      aud: 'https://appleid.apple.com',
      sub: this.configService.get('APPLE_CLIENT_ID'),
    };
    const privateKey = this.configService.get('APPLE_CLIENT_SECRET');
    const clientSecret = jwt.sign(payload, privateKey, {
      header,
    });
    return clientSecret;
  }

  async appleSignup(
    dto: AppleSignupRequestDto,
    // transaction = new TransactionManager(),
  ) {
    const user = await this.authService.verifyAppleToken(dto.identityToken);

    const clientSecret = this.createAppleClientSecret();
    const data = new URLSearchParams();
    data.append('client_id', `${this.configService.get('APPLE_CLIENT_ID')}`);
    data.append('client_secret', `${clientSecret}`);
    data.append('code', `${dto.authorizationCode}`);
    data.append('grant_type', 'authorization_code');

    const response: any = await lastValueFrom(
      this.httpService
        .post('https://appleid.apple.com/auth/token', data, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        .pipe(map((res: AxiosResponse<any>) => res.data)),
    ).catch((e) => {
      console.log('error', e);
      throw new HttpException('Apple Login Error', HttpStatus.BAD_REQUEST);
    });
    const isExistUser = await this.findByAppleId(user.sub);
    if (isExistUser) {
      await this.usersRepository.update(isExistUser.dbUserId, {
        appleId: user.sub,
        refreshToken: response.refresh_token,
      });
      const newUser = await this.usersRepository.findOne({
        where: { appleId: user.sub },
      });
      const payload = { sub: newUser.dbUserId, appleId: newUser.appleId };
      return {
        accessToken: this.jwtService.sign(payload),
      };
    }

    const newUser: User = await this.usersRepository.save({
      appleId: user.sub,
      refreshToken: response.refresh_token,
    });

    const payload = { sub: newUser.dbUserId, appleId: newUser.appleId };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async appleResign(user: User) {
    const resignUser = await this.usersRepository.findOne({
      where: { dbUserId: user.dbUserId },
    });
    const response: any = await lastValueFrom(
      this.httpService
        .post(
          `https://appleid.apple.com/auth/revoke?token=${resignUser.refreshToken}&client_id=${this.configService.get('APPLE_CLIENT_ID')}&client_secret=${this.createAppleClientSecret()}&token_type_hint=refresh_token`,
        )
        .pipe(map((res: AxiosResponse<any>) => res.data)),
    ).catch((e) => {
      console.log('error', e);
      throw new HttpException('Apple Resign Error', HttpStatus.BAD_REQUEST);
    });

    await this.usersRepository.delete({ dbUserId: user.dbUserId });

    return { message: 'success' };
  }

  async createUserInfo(dto: userInfoRequestDto, user: User): Promise<UserInfo> {
    const { location, ...filteredDto } = dto;
    const UserLocationInfo = {
      location1: location[0],
      location2: location[1],
      location3: location[2],
    };

    for (const key in UserLocationInfo) {
      if (!UserLocationInfo[key]) {
        delete UserLocationInfo[key];
      }
    }
    const newUserInfo: UserInfo = await this.userInfoRepository.save({
      dbUserId: user.dbUserId,
      ...UserLocationInfo,
      ...filteredDto,
    });

    await this.usersRepository.update(user.dbUserId, {
      isUserInfoGenerated: true,
    });

    return newUserInfo;
  }

  async updateUserInfo(dto: userInfoRequestDto, user: User): Promise<UserInfo> {
    const { location, ...filteredDto } = dto;
    const UserLocationInfo = {
      location1: location[0],
      location2: location[1],
      location3: location[2],
    };

    for (const key in UserLocationInfo) {
      if (!UserLocationInfo[key]) {
        UserLocationInfo[key] = null;
      }
    }

    const userInfo = await this.userInfoRepository.findOne({
      where: { dbUserId: user.dbUserId },
    });

    const updatedUserInfo = await this.userInfoRepository.save({
      dbUserId: userInfo.dbUserId,
      ...userInfo,
      ...UserLocationInfo,
      ...filteredDto,
    });

    return updatedUserInfo;
  }

  async findByAppleId(appleId: string): Promise<User> {
    return this.usersRepository.findOne({ where: { appleId } });
  }
}
