import { Module } from '@nestjs/common';
import { DBModule } from 'src/db/db.module';
import { UsersAPIController } from './api.controller';
import { UsersService } from './users.service';

@Module({
	imports: [DBModule],
	controllers: [UsersAPIController],
	providers: [UsersService],
	exports: [UsersService]
})
export class UsersModule {}

