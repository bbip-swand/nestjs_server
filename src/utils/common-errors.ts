import { HttpException, HttpStatus } from '@nestjs/common';

export const USER_NOT_EXISTS = new HttpException(
  {
    status: HttpStatus.UNAUTHORIZED,
    error: 'USER_NOT_EXISTS',
  },
  HttpStatus.UNAUTHORIZED,
);
