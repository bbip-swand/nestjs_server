import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  Type,
  mixin,
} from '@nestjs/common';
import { classToPlain, plainToClass } from 'class-transformer';
import { memoize } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const ResponseTransformInterceptor: <T>(
  itemType: Type<T>,
) => Type<NestInterceptor> = memoize(createTransformInterceptor);

function createTransformInterceptor<T>(
  itemType: Type<T>,
): Type<NestInterceptor> {
  class TransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, call$: CallHandler): Observable<any> {
      return call$.handle().pipe(
        map((data) => {
          return classToPlain(plainToClass(itemType, classToPlain(data)), {
            excludeExtraneousValues: true,
          });
        }),
      );
    }
  }
  return mixin(TransformInterceptor);
}
