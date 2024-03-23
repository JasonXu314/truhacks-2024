import { User } from '@prisma/client';

declare global {
	namespace Express {
		// These open interfaces may be extended in an application-specific manner via declaration merging.
		// See for example method-override.d.ts (https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/method-override/index.d.ts)
		interface Request {
			user: User | null;
			token: string | null;
		}
	}
}

