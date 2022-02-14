import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import type { OgmaService } from '@ogma/nestjs-module';
import type { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost, private readonly logger: OgmaService) {}

    catch(exception: any, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        if (httpStatus === 500) {
            this.logger.printError(exception);
        }

        const responseBody = {
            statusCode: httpStatus,
            timestamp: new Date().toISOString(),
            detail: (exception?.getResponse && exception.getResponse()) || 'Internal Server Error',
            path: httpAdapter.getRequestUrl(ctx.getRequest())
        };
        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
}
