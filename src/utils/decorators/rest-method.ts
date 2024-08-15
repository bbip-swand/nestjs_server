import { applyDecorators, UseInterceptors, UsePipes } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { ResponseTransformInterceptor } from '../interceptors/transform.interceptor';
import { ArrayValidationPipe } from '../pipes/array-validation.pipe';

// transformer에 request/response DTO를 강제한다.
// request 또는 response 중 필요한 것만 DTO 정의 가능
export function RestMethod({
  request: requestType,
  response: responseType,
}: {
  request?: any;
  response?: any;
}) {
  const singleResponseType = Array.isArray(responseType)
    ? responseType[0]
    : responseType;
  const singleRequestType = Array.isArray(requestType)
    ? requestType[0]
    : requestType;

  const decorators = [];
  if (requestType) {
    decorators.push(ApiBody({ type: requestType }));
    decorators.push(UsePipes(ArrayValidationPipe(singleRequestType)));
  }
  if (responseType) {
    decorators.push(ApiResponse({ status: 200, type: responseType }));
    decorators.push(
      UseInterceptors(ResponseTransformInterceptor(singleResponseType)),
    );
  }
  return applyDecorators(...decorators);
}
