import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DBService extends PrismaClient implements OnModuleInit {
	public async onModuleInit(): Promise<void> {
		return this.$connect();
	}
}

