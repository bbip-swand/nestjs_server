import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createLoginDto } from './dto/create-login.dto';
import { UpdateLoginDto } from './dto/update-login.dto';
import { JwksClient } from 'jwks-rsa';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

dotenv.config();

@Injectable()
export class LoginService {

  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async appleLogin(loginDto: createLoginDto) {
    try {
      const {idToken, email} = loginDto;
      const resourceId = (await this.decodeIdToken(idToken)).sub;
      
      //db에서 해당 resourceId로 유저 정보 찾기 - 구현 필요
      const findUser = await this.usersService.getUserInfoByResourceId(resourceId);

      let user: User;
      if (findUser) {
        user = findUser;
      } else {
        //db에 유저 정보가 없으면 새로 생성 - 구현 필요
        user = await this.usersService.createUser(resourceId, email);
      }

      const payload = { id: user.id };
      return {
        accessToken: await this.jwtService.signAsync(payload),
        refreshToken: await this.jwtService.signAsync(payload, {
          expiresIn: '30d',
          secret: process.env.JWT_SECRET_REFRESH,
        }),
    };
    } catch(error) {
      throw new UnauthorizedException('Apple 로그인에 실패했습니다.');
    }
  }

  async resolveUserInfoFromApple(accessToken: string) {
    try {
      return await getAppleOAuthInfo(accessToken);
    } catch (error) {
      printError(e);

      throw WrongAuth();
    }
  }

  private async decodeIdToken(idToken) {
    const kid = jwt.decode(idToken, {
      complete: true,
    }).header.kid;

    const client = new JwksClient({
      jwksUri: 'https://appleid.apple.com/auth/keys',
    });

    const key = await client.getSigningKey(kid);
    const verifyingKey = key.getPublicKey();

    const decodedResult = jwt.verify(idToken, verifyingKey, {
      algorithms: ['RS256'],
    });

    const decodedIdToken =
      typeof decodedResult === 'string'
        ? JSON.parse(decodedResult)
        : decodedResult;

    if (
      decodedIdToken.iss !== 'https://appleid.apple.com' ||
      decodedIdToken.aud !== process.env.CLIENT_ID
    ) {
      throw new UnauthorizedException(
        'identity 토큰 내의 정보가 올바르지 않습니다.'
      );
    }
    return decodedIdToken;
  }

  create(createLoginDto: CreateLoginDto) {
    return 'This action adds a new login';
  }

  findAll() {
    return `This action returns all login`;
  }

  findOne(id: number) {
    return `This action returns a #${id} login`;
  }

  update(id: number, updateLoginDto: UpdateLoginDto) {
    return `This action updates a #${id} login`;
  }

  remove(id: number) {
    return `This action removes a #${id} login`;
  }
}
