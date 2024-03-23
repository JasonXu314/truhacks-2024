import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Length } from 'class-validator';
import { fi } from 'src/utils/utils';

export class RequestTopicDTO {
	@IsString()
	@Length(1, 36)
	@ApiProperty({ maxLength: 36, minLength: 1 })
	title: string = fi();

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
}

