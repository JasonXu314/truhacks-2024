import { Prisma } from '@prisma/client';

export const full = Prisma.validator<Prisma.FieldDefaultArgs>()({
	include: {
		subjects: {
			orderBy: { id: 'asc' }
		}
	}
});

export type FullField = Prisma.FieldGetPayload<typeof full>;

