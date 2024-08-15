import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';
import { UsersService } from 'src/users/users.service';
import { AUTHORIZATION_TYPE } from './auth.types';

interface AppleJwtTokenPayload {
  iss: string;
  aud: string;
  exp: number;
  iat: number;
  sub: string;
  nonce: string;
  c_hash: string;
  email?: string;
  email_verified?: string;
  is_private_email?: string;
  auth_time: number;
  nonce_supported: boolean;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private readonly configService: ConfigService,
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
    return;
  }

  // 가드에서 걸러지지 않은 요청이므로 이미 회원가입돼 있는 유저
  // 기본 정보 및 refresh token은 이미 기입돼 있을 것이므로 uuid만 교체
  async appleLogin(appleSubjectId: string) {
    // 근데 생각해보니 uuid를 사용하여 지금 db를 불필요하게 한번 조회하여 수정하고
    // db와 매번 대조검증 하는 것보다 만료되지 않는 jwt를 발급해주는 게 더 나을지도?
    return;
  }

  async validateUser(identityToken: string) {
    const result = await this.verifyAppleToken(identityToken).catch((error) => {
      throw new UnauthorizedException(
        AUTHORIZATION_TYPE.INVALID_IDENTITY_TOKEN,
      );
    });
    const appleSubjectId = result.sub;

    const user = await this.usersService.findByAppleId(appleSubjectId);
    if (!user) {
      throw new UnauthorizedException(AUTHORIZATION_TYPE.UNREGISTERED_USER);
    }

    return appleSubjectId;
  }

  async verifyAppleToken(identityToken: string): Promise<AppleJwtTokenPayload> {
    const decoded = jwt.decode(identityToken, { complete: true }) as {
      header: { kid: string; alg: jwt.Algorithm };
      payload: { sub: string };
    };
    const keyIdFromToken = decoded.header.kid;

    const applePublicKey = new JwksClient({
      jwksUri: 'https://appleid.apple.com/auth/keys',
    });

    const key = await applePublicKey.getSigningKey(keyIdFromToken);
    const publicKey = key.getPublicKey();

    const verifiedDecodedToken: AppleJwtTokenPayload = jwt.verify(
      identityToken,
      publicKey,
      {
        algorithms: [decoded.header.alg],
      },
    ) as AppleJwtTokenPayload;

    return verifiedDecodedToken;
  }
}
