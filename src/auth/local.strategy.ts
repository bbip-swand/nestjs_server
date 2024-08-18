import {
  CanActivate,
  ExecutionContext,
  Injectable,
  mixin,
  Type,
} from '@nestjs/common';
import { AuthService } from './auth.service';

export const LocalAuthGuard = (): Type<CanActivate> => {
  @Injectable()
  class LocalAuthGuardMixin implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const req = context.switchToHttp().getRequest();
      const identityToken = req.body.identityToken;
      const result = await this.authService.validateUser(identityToken);
      req.user = result;

      return true;
    }
  }
  return mixin(LocalAuthGuardMixin);
};
