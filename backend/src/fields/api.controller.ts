import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Post, Redirect, Res } from '@nestjs/common';
import { Field, Subject } from '@prisma/client';
import { Response } from 'express';
import { CreateFieldDTO, CreateSubjectDTO } from './dtos';
import { FieldsService } from './fields.service';
import { FullField } from './models';

@Controller({ path: '/api/fields' })
export class FieldsAPIController {
	constructor(private readonly service: FieldsService) {}

	@Post('/')
	@Redirect('/fields', HttpStatus.SEE_OTHER)
	public async signup(@Body() data: CreateFieldDTO): Promise<Field> {
		return this.service.create(data);
	}

	@Get('/')
	public async get(): Promise<FullField[]> {
		return this.service.getAll();
	}

	@Post('/:id/subjects')
	public async getSubjects(
		@Param('id', ParseIntPipe) id: number,
		@Body() data: CreateSubjectDTO,
		@Res({ passthrough: true }) res: Response
	): Promise<Subject> {
		const subject = await this.service.addSubject(id, data);

		res.status(HttpStatus.SEE_OTHER);
		res.setHeader('Location', `/fields/${id}`);

		return subject;
	}
}

