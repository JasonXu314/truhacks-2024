import { DynamicModule, Module } from '@nestjs/common';

export const DATA_SOURCE = Symbol('AUTH_DATA_SOURCE'),
	PREFIX = Symbol('AUTH_PREFIX');

export abstract class AuthDataSource {
	public abstract auth(token: string): any | null | Promise<any | null>;
}

export interface AuthModuleOptions {
	prefix: string;
}

@Module({})
export class AuthModule {
	public static register({ prefix }: AuthModuleOptions): DynamicModule {
		return {
			module: AuthModule,
			providers: [{ provide: PREFIX, useValue: prefix }]
		};
	}
}

