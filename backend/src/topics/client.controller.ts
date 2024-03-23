import { Controller, Get } from '@nestjs/common';
import { Page } from 'src/utils/decorators/page.decorator';

@Controller({ path: '/topics' })
export class TopicsClientController {
	@Get('/:id/eavesdrop')
	@Page()
	public async get(): Promise<PageProps> {
		return {};
	}
}

