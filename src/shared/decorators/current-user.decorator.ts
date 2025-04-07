import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUser } from '../interface/interface';

export const AuthenticatedUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as CurrentUser | undefined;

    return data ? user && user[data] : user;
  },
);
