import { CanActivate, ExecutionContext, Inject, Injectable, forwardRef } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { Redirect } from 'src/utils/filters/redirect.filter';
import { PREFIX } from './auth.module';
import { Protected } from './protected.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
	public constructor(@Inject(forwardRef(() => PREFIX)) private readonly prefix: string, private readonly reflector: Reflector) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const metadata = this.reflector.get(Protected, context.getHandler());

		if (metadata) {
			const { requireAdmin } = metadata;

			const req = context.switchToHttp().getRequest<Request>(),
				res = context.switchToHttp().getResponse<Response>();
			const user = req.user,
				token = req.token;

			if (user === null && token !== null) {
				res.clearCookie(`${this.prefix}::token`);
				throw new Redirect('/login');
			} else if (user === null) {
				throw new Redirect('/login');
			} else {
				return !requireAdmin || user.admin;
			}
		} else {
			return true;
		}
	}
}

