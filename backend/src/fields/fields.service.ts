import { Injectable } from '@nestjs/common';
import { Field, Subject } from '@prisma/client';
import { DBService } from 'src/db/db.service';
import { CreateFieldDTO, CreateSubjectDTO } from './dtos';
import { FullField, full } from './models';

@Injectable()
export class FieldsService {
	public constructor(private readonly db: DBService) {}

	public async create(data: CreateFieldDTO): Promise<Field> {
		return this.db.field.create({ data });
	}

	public async get(id: number): Promise<FullField | null> {
		return this.db.field.findUnique({ where: { id }, ...full });
	}

	public async getAll(): Promise<FullField[]> {
		return this.db.field.findMany({ orderBy: { id: 'asc' }, ...full });
	}

	public async addSubject(id: number, { name }: CreateSubjectDTO): Promise<Subject> {
		return this.db.subject.create({ data: { name, field: { connect: { id } } } });
	}
}

