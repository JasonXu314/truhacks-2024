import { Body, Controller, Post } from '@nestjs/common';
import { TopicRequest } from '@prisma/client';
import { RequestTopicDTO } from './dtos';
import { TopicsService } from './topics.service';

@Controller({ path: '/api/topics' })
export class TopicsAPIController {
	constructor(private readonly service: TopicsService) {}

	@Post('/request')
	public async signup(@Body() data: RequestTopicDTO): Promise<TopicRequest> {
		return this.service.createRequest(data);
	}
}

