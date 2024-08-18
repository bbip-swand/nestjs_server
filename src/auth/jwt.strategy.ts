import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/models/user.entity';
import { UsersService } from '../users/users.service';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any) {
    const user: User = await this.usersService.findByAppleId(payload.appleId);

    const accessToken = req.headers['authorization']
      ?.split('Bearer')
      ?.pop()
      ?.trim();

    if (!user) {
      throw new UnauthorizedException();
    }
    const { refreshToken, ...result } = user;

    return {
      ...result,
      accessToken,
    };
  }
}
