import { applyDecorators, Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';

import { UserRole } from 'src/models/user.entity.types';

export function MemberJwtController(
  mapping = '/',
  { role }: { role: UserRole | 'any' } = { role: UserRole.MEMBER },
) {
  const decorators = [
    Roles(role),
    ApiBearerAuth('JWT'),
    Controller(mapping),
    ApiTags(mapping),
  ];
  // if (role === UserRole.MEMBER) {}
  return applyDecorators(...decorators);
}
