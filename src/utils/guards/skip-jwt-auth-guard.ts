import { SetMetadata } from '@nestjs/common';

// JWT 인증 없이 call 가능하도록 하는 decorators
export const SkipJwtAuthGuard = SetMetadata('skip-jwt-auth-guard', true);
