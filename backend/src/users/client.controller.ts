import { Controller, Get } from '@nestjs/common';
import { User } from '@prisma/client';
import { Page } from 'src/utils/decorators/page.decorator';
import { UsersService } from './users.service';

@Controller({ path: '/users' })
export class UsersClientController {
	constructor(private readonly service: UsersService) {}

	@Get('/')
	@Page()
	public async get(): Promise<PageProps<{ users: User[] }>> {
		return { users: await this.service.getAll() };
	}
}

