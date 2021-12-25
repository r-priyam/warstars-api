import * as chalk from 'chalk';
import * as moment from 'moment';
import util from 'util';
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
	private label: string;

	constructor(label?: string) {
		this.label = label;
	}

	log(message: string): void {
		return this.formatedLog(message, { tag: 'info' });
	}

	info(message: string): void {
		return this.formatedLog(message, { tag: 'info' });
	}

	error(message: string, trace?: any): void {
		return this.formatedLog(message, { trace, tag: 'error' });
	}

	warn(message: string): void {
		return this.formatedLog(message, { tag: 'warn' });
	}

	debug(message: string): void {
		return this.formatedLog(message, { tag: 'debug' });
	}

	private formatedLog(message: string | any, { trace, tag }: { trace?: any; label?: string; tag: string }): void {
		const timestamp = chalk.cyan(moment().utcOffset('+05:30').format('DD-MM-YYYY kk:mm:ss'));
		const content = this.clean(message);
		const stream = trace ? process.stderr : process.stdout;
		stream.write(
			`[${timestamp}] ${chalk[COLORS[tag]].bold(TAGS[tag])} » ${
				this.label ? `[${chalk.blue(this.label)}] » ` : ''
			}${content}\n`,
		);
	}

	private clean(message: string | any) {
		if (typeof message === 'string') return message;
		return util.inspect(message, { depth: Infinity });
	}
}
