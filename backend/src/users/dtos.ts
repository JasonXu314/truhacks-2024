import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsPhoneNumber, IsString, Length } from 'class-validator';
import { fi } from 'src/utils/utils';

export class SignupDTO {
	@IsString()
	@Length(1, 18)
	@ApiProperty({ maxLength: 18, minLength: 1 })
	name: string = fi();

	@IsString()
	@IsEmail()
	@ApiProperty()
	email: string = fi();

	@IsString()
	@IsPhoneNumber('US')
	@ApiProperty()
	phone: string = fi();

	@IsString()
	@ApiProperty()
	password: string = fi();
}

export class LoginDTO {
	@IsString()
	@IsEmail()
	@ApiProperty()
	email: string = fi();

	@IsString()
	@ApiProperty()
	password: string = fi();
}

