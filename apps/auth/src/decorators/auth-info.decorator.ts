import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IAuthInfo } from '../auth.interface';

const AuthInfo = createParamDecorator((data: unknown, ctx: ExecutionContext): IAuthInfo => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});

export default AuthInfo;
