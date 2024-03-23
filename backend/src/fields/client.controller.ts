import { Controller, Get, NotFoundException, Param, ParseIntPipe } from '@nestjs/common';
import { Page } from 'src/utils/decorators/page.decorator';
import { FieldsService } from './fields.service';
import { FullField } from './models';

@Controller({ path: '/fields' })
export class FieldsClientController {
	constructor(private readonly service: FieldsService) {}

	@Get('/')
	@Page()
	public async get(): Promise<PageProps<{ fields: FullField[] }>> {
		return { fields: await this.service.getAll() };
	}

	@Get('/:id')
	@Page()
	public async getField(@Param('id', ParseIntPipe) id: number): Promise<{ field: FullField }> {
		const field = await this.service.get(id);

		if (field === null) {
			throw new NotFoundException('No such field');
		} else {
			return { field };
		}
	}
}

