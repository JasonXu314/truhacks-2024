import { Module } from '@nestjs/common';
import { DBModule } from 'src/db/db.module';
import { UsersAPIController } from './api.controller';
import { UsersClientController } from './client.controller';
import { UsersService } from './users.service';

@Module({
	imports: [DBModule],
	controllers: [UsersClientController, UsersAPIController],
	providers: [UsersService],
	exports: [UsersService]
})
export class UsersModule {}

