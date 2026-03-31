import { createParamDecorator, ExecutionContext } from '@nestjs/common';

type RequestWithUser = {
  user: {
    sub: string;
    email: string;
    role: string;
  };
};

export const GetUser = createParamDecorator((data: keyof RequestWithUser['user'] | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<RequestWithUser>();
  if (!data) {
    return request.user;
  }
  return request.user[data];
});