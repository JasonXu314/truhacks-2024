import { config } from 'dotenv';
config();

import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { svelte } from './client/template-engine';
import { ErrorPageFilter } from './utils/filters/error-page.filter';
import { RedirectFilter } from './utils/filters/redirect.filter';
import { RoutingInterceptor } from './utils/interceptors/routing.interceptor';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	app.engine('svelte', svelte);
	app.setViewEngine('svelte');
	app.setBaseViewsDir('src/client/routes');

	app.enableCors({ origin: true });
	app.use(cookieParser())
		.useGlobalPipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }))
		.useGlobalFilters(new ErrorPageFilter(app.get(HttpAdapterHost).httpAdapter), new RedirectFilter())
		.useGlobalInterceptors(new RoutingInterceptor());

	const config = new DocumentBuilder().setTitle('Educate All Backend').setDescription('Backend for Educate All application').setVersion('1.0').build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('docs', app, document);

	if (process.env.NODE_ENV !== 'development') {
		await app.listen(process.env.PORT || 5000);
	}

	return app;
}
export const viteNodeApp = bootstrap();

