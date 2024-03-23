import { Module } from '@nestjs/common';
import { DBModule } from 'src/db/db.module';
import { TopicsAPIController } from './api.controller';
import { TopicsService } from './topics.service';

@Module({
	imports: [DBModule],
	controllers: [TopicsAPIController],
	providers: [TopicsService],
	exports: [TopicsService]
})
export class TopicsModule {}

