import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientValidationError, Prisma.PrismaClientKnownRequestError)
export class PrismaErrorFilter extends BaseExceptionFilter {
	public catch(exception: unknown, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		if (exception instanceof Prisma.PrismaClientValidationError) {
			const { message } = exception;

			response.status(400).json({ statusCode: 400, message });
		} else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
			const { message, code, name, meta } = exception;

			console.log('stuff', name, code, meta);

			switch (code) {
				case 'P2002':
					if (meta !== undefined) {
						const match = new RegExp(`${meta.modelName}_(.+)_key`).exec(meta.target as string);

						if (match !== null) {
							response.status(400).json({ statusCode: 400, message: `Duplicate \`${match[1]}\` value` });
						} else {
							response.status(400).json({ statusCode: 400, message });
						}

						break;
					} else {
						response.status(400).json({ statusCode: 400, message });
						break;
					}
				default:
					response.status(400).json({ statusCode: 400, message });
			}
		} else {
			super.catch(exception, host);
		}
	}
}

