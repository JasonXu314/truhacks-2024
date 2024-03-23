import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthMiddleware } from './auth/auth.middleware';
import { AuthModule, DATA_SOURCE, PREFIX } from './auth/auth.module';
import { DBModule } from './db/db.module';
import { FieldsModule } from './fields/fields.module';
import { TopicsModule } from './topics/topics.module';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';

@Module({
	imports: [
		DBModule,
		UsersModule,
		TopicsModule,
		FieldsModule,
		AuthModule.register({ prefix: 'placeholder' }),
		ServeStaticModule.forRoot({
			rootPath: 'dist/client/assets',
			serveRoot: '/__app'
		}),
		ServeStaticModule.forRoot({
			rootPath: 'src/client/public',
			serveRoot: '/'
		})
	],
	controllers: [AppController],
	providers: [AppService, { provide: PREFIX, useValue: 'educate-all' }, { provide: DATA_SOURCE, useClass: UsersService }]
})
export class AppModule implements NestModule {
	public configure(consumer: MiddlewareConsumer): void {
		consumer.apply(AuthMiddleware).forRoutes('*');
	}
}

