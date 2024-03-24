import { Injectable } from '@nestjs/common';
import { TopicRequest, User } from '@prisma/client';
import { DBService } from 'src/db/db.service';
import { AppGateway } from 'src/gateway/app.gateway';
import { RequestTopicDTO } from './dtos';

@Injectable()
export class TopicsService {
	public constructor(private readonly db: DBService, private readonly gateway: AppGateway) {}

	public async createRequest({
		description,
		fields,
		subjects,
		token
	}: RequestTopicDTO): Promise<TopicRequest & { author: Pick<User, 'id' | 'name'>; otp: string }> {
		const topic = await this.db.topicRequest.create({
			data: {
				description,
				fields: { connect: fields.map((id) => ({ id })) },
				subjects: { connect: subjects.map((id) => ({ id })) },
				author: { connect: { token } }
			},
			include: {
				author: {
					select: {
						id: true,
						name: true
					}
				}
			}
		});

		const otp = this.gateway.allocateSession(topic, topic.author);

		return { ...topic, otp };
	}

	public async makeOffer(user: User, data: string): Promise<string> {
		return this.gateway.makeOffer(user.id, data);
	}

	public tutorJoin(user: User, topicId: number): { signal: string; otp: string } {
		return this.gateway.createTutorOTP(topicId, user);
	}
}

