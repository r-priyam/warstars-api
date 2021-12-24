import * as chalk from 'chalk';
import * as moment from 'moment';
import { LoggerService } from '@nestjs/common';

const COLORS: { [key: string]: 'red' | 'cyan' | 'yellow' | 'magenta' } = {
	debug: 'yellow',
	info: 'cyan',
	warn: 'magenta',
	error: 'red',
};

const TAGS: { [key: string]: string } = {
	debug: '[DEBUG]',
	info: '[INFO ]',
	warn: '[WARN ]',
	error: '[ERROR]',
};

export class Logger implements LoggerService {
	log(message: string, { label }: { label?: string }): void {
		return (this.constructor as typeof Logger).formatedLog(message, { label, tag: 'info' });
	}

	info(message: string, { label }: { label?: string }): void {
		return (this.constructor as typeof Logger).formatedLog(message, { label, tag: 'info' });
	}

	error(message: string, trace?: any) {
		return (this.constructor as typeof Logger).formatedLog(message, { trace, label: null, tag: 'error' });
	}

	warn(message: string, { label }: { label?: string }) {
		return (this.constructor as typeof Logger).formatedLog(message, { label, tag: 'warn' });
	}

	debug(message: string, { label }: { label?: string }) {
		return (this.constructor as typeof Logger).formatedLog(message, { label, tag: 'debug' });
	}

	private static formatedLog(
		message: string | any,
		{ trace, label, tag }: { trace?: any; label?: string; tag: string },
	) {
		const timestamp = chalk.cyan(moment().utcOffset('+05:30').format('DD-MM-YYYY kk:mm:ss'));
		console.log(
			`[${timestamp}] ${chalk[COLORS[tag]].bold(TAGS[tag])} » ${
				label ? `[${chalk.blue(label)}] » ` : ''
			}${message}`,
		);
		if (trace) console.log(trace);
	}
}
