import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { randomBytes } from 'crypto';
import { AuthDataSource } from 'src/auth/auth.module';
import { DBService } from 'src/db/db.service';
import { LoginDTO, SignupDTO } from './dtos';

@Injectable()
export class UsersService implements AuthDataSource {
	public constructor(private readonly db: DBService) {}

	public async create({ name, email, phone, password }: SignupDTO): Promise<User> {
		const hashedPassword = await hash(password, 10);
		const token = randomBytes(16).toString('hex');

		return this.db.user.create({ data: { name, email, phone, verifiedTutor: false, password: hashedPassword, token } });
	}

	public async login({ email, password }: LoginDTO): Promise<User | null> {
		const user = await this.db.user.findUnique({ where: { email } });

		if (user !== null && (await compare(password, user.password))) {
			return user;
		} else {
			return null;
		}
	}

	public async getAll(): Promise<User[]> {
		return this.db.user.findMany();
	}

	public async auth(token: string): Promise<User | null> {
		return this.db.user.findUnique({ where: { token } });
	}
}

