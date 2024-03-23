import { BadRequestException, Body, Controller, Get, Post, Query } from '@nestjs/common';
import { LoginDTO, SignupDTO } from './dtos';
import { SensitiveUser, toSensitiveUser } from './models';
import { UsersService } from './users.service';

@Controller({ path: '/api/users' })
export class UsersAPIController {
	constructor(private readonly service: UsersService) {}

	@Post('/signup')
	public async signup(@Body() data: SignupDTO): Promise<SensitiveUser> {
		const user = await this.service.create(data);

		return toSensitiveUser(user);
	}

	@Post('/login')
	public async login(@Body() data: LoginDTO): Promise<SensitiveUser> {
		const user = await this.service.login(data);

		if (user === null) {
			throw new BadRequestException('Incorrect username/password');
		}

		return toSensitiveUser(user);
	}

	@Get('/me')
	public async me(@Query('token') token: string): Promise<SensitiveUser> {
		const user = await this.service.auth(token);

		if (user === null) {
			throw new BadRequestException('Invalid token');
		}

		return toSensitiveUser(user);
	}
}

