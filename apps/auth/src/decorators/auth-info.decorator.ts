import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const AuthInfoFactory = (data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
};

export const AuthInfo = createParamDecorator(AuthInfoFactory);
