import { IsArray, IsInt, IsString, Length } from 'class-validator';
import { fi } from './utils/utils';

export class ClaimCodeDTO {
	@IsString()
	otp: string = fi();
}

export class EavesdropDTO {
	@IsInt()
	id: number = fi();
}

export class NewStrokeDTO {
	@IsString()
	@Length(32, 32)
	id: string = fi();

	@IsArray({ each: true })
	pts: [number, number][] = fi();

	@IsString()
	color: string = fi();
}

export interface ClaimAcknowledgeDTO {
	type: 'CLAIM_ACK';
}

export interface ClientErrorDTO {
	type: 'CLIENT_ERROR';
}

export interface MessageAckDTO {
	type: 'MESSAGE_ACK';
}

