import { Module } from '@nestjs/common';
import { DBModule } from 'src/db/db.module';
import { GatewayModule } from 'src/gateway/gateway.module';
import { UsersModule } from 'src/users/users.module';
import { TopicsAPIController } from './api.controller';
import { TopicsClientController } from './client.controller';
import { TopicsService } from './topics.service';

@Module({
	imports: [DBModule, GatewayModule, UsersModule],
	controllers: [TopicsClientController, TopicsAPIController],
	providers: [TopicsService],
	exports: [TopicsService]
})
export class TopicsModule {}

