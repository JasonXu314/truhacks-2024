import { Body, Controller, ForbiddenException, Post } from '@nestjs/common';
import { TopicRequest } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { OfferP2PDTO, RequestTopicDTO, TutorJoinDTO } from './dtos';
import { TopicsService } from './topics.service';

@Controller({ path: '/api/topics' })
export class TopicsAPIController {
	constructor(private readonly service: TopicsService, private readonly users: UsersService) {}

	@Post('/request')
	public async requestTopic(@Body() data: RequestTopicDTO): Promise<TopicRequest & { author: Pick<User, 'id' | 'name'>; otp: string }> {
		return this.service.createRequest(data);
	}

	@Post('/offer')
	public async offer(@Body() { data, token }: OfferP2PDTO): Promise<string> {
		const user = await this.users.auth(token);

		if (user === null) {
			throw new ForbiddenException('Bad token');
		} else {
			return this.service.makeOffer(user, data);
		}
	}

	@Post('/tutor-join')
	public async tutorJoin(@Body() { id, token }: TutorJoinDTO): Promise<string> {
		const user = await this.users.auth(token);

		if (user === null) {
			throw new ForbiddenException('Bad token');
		} else {
			return this.service.tutorJoin(user, id);
		}
	}
}

