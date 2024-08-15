import {
  ArgumentMetadata,
  mixin,
  PipeTransform,
  Type,
  ValidationPipe,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { memoize } from 'lodash';

export const ArrayValidationPipe: <T>(
  itemType: Type<T>,
) => Type<PipeTransform> = memoize(createArrayValidationPipe);

function createArrayValidationPipe<T>(itemType: Type<T>): Type<PipeTransform> {
  class MixinArrayValidationPipe
    extends ValidationPipe
    implements PipeTransform
  {
    transform(values: any[], metadata: ArgumentMetadata): Promise<any[]> {
      return Promise.resolve(
        plainToClass(itemType, values, { excludeExtraneousValues: true }),
      );
    }
  }

  return mixin(MixinArrayValidationPipe);
}
