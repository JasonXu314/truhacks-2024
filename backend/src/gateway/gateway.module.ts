import { Module } from '@nestjs/common';
import { DBModule } from 'src/db/db.module';
import { AppGateway } from './app.gateway';

@Module({
	imports: [DBModule],
	controllers: [],
	providers: [AppGateway],
	exports: [AppGateway]
})
export class GatewayModule {}

