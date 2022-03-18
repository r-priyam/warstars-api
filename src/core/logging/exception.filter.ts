import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { OgmaService } from '@ogma/nestjs-module';
import { MessageEmbed, WebhookClient } from 'discord.js';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost, private readonly logger: OgmaService) {}

    async catch(exception: any, host: ArgumentsHost) {
        const webhook = new WebhookClient({
            id: process.env.WEBHOOK_ID,
            token: process.env.WEBHOOK_TOKEN
        });

        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        if (httpStatus === 500) {
            this.logger.printError(exception);
            const embed = new MessageEmbed()
                .setTitle('Error')
                .setDescription(`\`\`\`js\n${String(exception).substring(0, 4000)}\`\`\``)
                .addFields({ name: 'Path', value: `\`${httpAdapter.getRequestUrl(ctx.getRequest())}\`` })
                .setColor('#ff0000')
                .setTimestamp();
            process.env.ENV === 'production' && (await webhook.send({ content: '<@554882868091027456>, ERROR', embeds: [embed] }));
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
