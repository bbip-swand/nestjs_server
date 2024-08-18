import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';
import { User } from 'src/models/user.entity';
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
    private jwtService: JwtService,
  ) {}

  async appleLogin(user: Partial<User>) {
    const payload = { sub: user.dbUserId, appleId: user.appleId };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async validateUser(identityToken: string) {
    const result = await this.verifyAppleToken(identityToken);
    const appleSubjectId = result.sub;

    const user = await this.usersService.findByAppleId(appleSubjectId);
    if (!user) {
      throw new UnauthorizedException(AUTHORIZATION_TYPE.UNREGISTERED_USER);
    }
    const { refreshToken, ...userInfo } = user;

    return userInfo;
  }

  async verifyAppleToken(identityToken: string): Promise<AppleJwtTokenPayload> {
    try {
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
    } catch (error) {
      throw new UnauthorizedException(
        AUTHORIZATION_TYPE.INVALID_IDENTITY_TOKEN,
      );
    }
  }
}
