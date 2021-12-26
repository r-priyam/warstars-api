import { ArgumentsHost, Catch, ExceptionFilter as IExceptionFilter } from '@nestjs/common';
import { OgmaService } from '@ogma/nestjs-module';

@Catch()
export class ExceptionFilter implements IExceptionFilter {
	constructor(private readonly logger: OgmaService) {}

	catch(exception: any, host: ArgumentsHost) {
		this.logger.printError(exception);
		const res = host.switchToHttp().getResponse();
		res.status((exception?.getStatus && exception?.getStatus()) || 500).send(
			(exception?.getResponse && exception.getResponse()) || 'Internal Server Error'
		);
	}
}
