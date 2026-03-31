import {
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	handleRequest<TUser = unknown>(
		err: unknown,
		user: TUser,
		info: { message?: string },
	): TUser {
		if (err || !user) {
			if (info?.message === 'No auth token') {
				throw new UnauthorizedException('Authentication token is missing');
			}

			if (info?.message === 'jwt expired') {
				throw new UnauthorizedException('Authentication token has expired');
			}

			throw new UnauthorizedException('Authentication token is invalid');
		}

		return user;
	}

	canActivate(context: ExecutionContext) {
		return super.canActivate(context);
	}
}