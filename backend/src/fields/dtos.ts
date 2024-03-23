import { IsString } from 'class-validator';
import { fi } from 'src/utils/utils';

export class CreateFieldDTO {
	@IsString()
	name: string = fi();
}

export class CreateSubjectDTO {
	@IsString()
	name: string = fi();
}
