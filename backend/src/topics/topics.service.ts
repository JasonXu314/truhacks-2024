import { Injectable } from '@nestjs/common';
import { TopicRequest } from '@prisma/client';
import { DBService } from 'src/db/db.service';
import { RequestTopicDTO } from './dtos';

@Injectable()
export class TopicsService {
	public constructor(private readonly db: DBService) {}

	public async createRequest({ title, description, fields, subjects }: RequestTopicDTO): Promise<TopicRequest> {
		return this.db.topicRequest.create({
			data: { title, description, fields: { connect: fields.map((id) => ({ id })) }, subjects: { connect: subjects.map((id) => ({ id })) } }
		});
	}
}

