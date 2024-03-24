import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Length } from 'class-validator';
import { fi } from 'src/utils/utils';

export class RequestTopicDTO {
	@IsString()
	@Length(1, 512)
	@ApiProperty({ maxLength: 512, minLength: 1 })
	description: string = fi();

	@IsInt({ each: true })
	@ApiProperty({ isArray: true })
	fields: number[] = [];

	@IsInt({ each: true })
	@ApiProperty({ isArray: true })
	subjects: number[] = [];

	@IsString()
	@Length(32, 32)
	@ApiProperty({ maxLength: 32, minLength: 32 })
	token: string = fi();
}

export class OfferP2PDTO {
	@IsString()
	data: string = fi();

	@IsString()
	@Length(32, 32)
	@ApiProperty({ maxLength: 32, minLength: 32 })
	token: string = fi();
}

export class TutorJoinDTO {
	@IsString()
	id: number = fi();

	@IsString()
	@Length(32, 32)
	@ApiProperty({ maxLength: 32, minLength: 32 })
	token: string = fi();
}

