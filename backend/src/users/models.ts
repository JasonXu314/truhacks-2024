import { User } from '@prisma/client';

export type SensitiveUser = Omit<User, 'password'>;
export type PublicUser = Omit<User, 'phone' | 'password' | 'token' | 'email'>;

export function toSensitiveUser({ id, name, email, phone, verifiedTutor, token }: User): SensitiveUser {
	return { id, name, email, phone, verifiedTutor, token };
}

export function toPublicUser({ id, name, verifiedTutor }: User): PublicUser {
	return { id, name, verifiedTutor };
}

