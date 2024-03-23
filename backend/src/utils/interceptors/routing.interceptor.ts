import { CallHandler, ExecutionContext, Injectable, NestInterceptor, NotFoundException } from '@nestjs/common';
import { RENDER_METADATA } from '@nestjs/common/constants';
import { Request, Response } from 'express';
import { readdirSync, statSync } from 'fs';
import { Observable, from, throwError } from 'rxjs';
import { map, mergeAll } from 'rxjs/operators';
import { PAGE_METADATA } from '../decorators/page.decorator';

function resolveRoute(parts: string[], route: string, dir: string, params: Record<string, string>): string | null {
	if (parts.length === 0) {
		return route;
	}

	const available = readdirSync(dir);
	let pattern: string | undefined;

	if (parts.length === 1) {
		const [part] = parts;

		if (available.includes(`${part}.svelte`)) {
			return `${route}/${part}`;
		} else if (part === '' && available.includes('index.svelte')) {
			return `${route}/index`;
		} else if (available.includes(part) && statSync(`${dir}/${part}`).isDirectory() && readdirSync(`${dir}/${part}`).includes('index.svelte')) {
			return `${route}/${part}/index`;
		} else if (
			(pattern = available.find((route) => {
				const match = /\[(\w+)\]\.svelte/.exec(route);

				return match !== null && match[1] in params;
			})) !== undefined
		) {
			return `${route}/${pattern.replace('.svelte', '')}`;
		} else {
			return null;
		}
	} else {
		const [part, ...rest] = parts;

		if (available.includes(part) && statSync(`${dir}/${part}`).isDirectory()) {
			return resolveRoute(rest, route === '' ? `/${part}` : `${route}/${part}`, `${dir}/${part}`, params);
		} else if (
			(pattern = available.find((route) => {
				const match = /\[(\w+)\]/.exec(route);

				return match !== null && match[1] in params;
			})) !== undefined &&
			statSync(`${dir}/${pattern}`).isDirectory()
		) {
			return resolveRoute(rest, route === '' ? `/${pattern}` : `${route}/${pattern}`, `${dir}/${pattern}`, params);
		} else {
			return null;
		}
	}
}

@Injectable()
export class RoutingInterceptor implements NestInterceptor {
	public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const req = context.switchToHttp().getRequest<Request>(),
			res = context.switchToHttp().getResponse<Response>();

		// this case is mostly for backwards compatibility
		if (Reflect.hasMetadata(RENDER_METADATA, context.getHandler())) {
			const path: string = Reflect.getMetadata(RENDER_METADATA, context.getHandler());

			const parts = path.split('/').map((part, i, arr) => (i === arr.length - 1 ? part.replace('.svelte', '') : part));
			const route = parts.slice(parts.indexOf('routes') + 1).join('/');

			return next.handle().pipe(
				map((val) => {
					const props = val ?? {};

					const user = props.user ?? req.user;
					const defaultMeta = { route, path: req.path, user, params: req.params };
					const __meta = props.__meta ? { ...defaultMeta, ...props.__meta } : defaultMeta;

					if ('user' in props) delete props.user;
					if ('__meta' in props) delete props.__meta;

					return { props, __meta };
				})
			);
		} else if (Reflect.hasMetadata(PAGE_METADATA, context.getHandler())) {
			const parts = req.path.split('/');
			const route = resolveRoute(parts.slice(1), '', 'src/client/routes', req.params);

			if (route !== null) {
				return next.handle().pipe(
					map((val) => {
						const props = val ?? {};

						const user = props.user ?? req.user;
						const defaultMeta = { route, path: req.path, user, params: req.params };
						const __meta = props.__meta ? { ...defaultMeta, ...props.__meta } : defaultMeta;

						if ('user' in props) delete props.user;
						if ('__meta' in props) delete props.__meta;

						return from(
							new Promise((resolve, reject) =>
								res.render(route.slice(1), { props, __meta }, (err, html) => (err !== null ? reject(err) : resolve(html)))
							)
						);
					}),
					mergeAll()
				);
			} else {
				return throwError(() => new NotFoundException()); // TODO: consider adding message
			}
		} else {
			return next.handle();
		}
	}
}

