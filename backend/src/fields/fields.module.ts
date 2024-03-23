import { Module } from '@nestjs/common';
import { DBModule } from 'src/db/db.module';
import { FieldsAPIController } from './api.controller';
import { FieldsClientController } from './client.controller';
import { FieldsService } from './fields.service';

@Module({
	imports: [DBModule],
	controllers: [FieldsClientController, FieldsAPIController],
	providers: [FieldsService],
	exports: [FieldsService]
})
export class FieldsModule {}

