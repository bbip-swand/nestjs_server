import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles =
      this.reflector.get<boolean>(
        'skip-jwt-auth-guard',
        context.getHandler(),
      ) || false;

    const rolesClass =
      this.reflector.get<boolean>('skip-jwt-auth-guard', context.getClass()) ||
      false;

    // jwt-skip metadata가 있으면, AuthGuard를 skip (manuall 하게 controller에서 직접 달아주기..)
    if (roles || rolesClass) {
      return true;
    }
    const parentCanActivate = (await super.canActivate(context)) as boolean;
    return parentCanActivate;
  }
}
