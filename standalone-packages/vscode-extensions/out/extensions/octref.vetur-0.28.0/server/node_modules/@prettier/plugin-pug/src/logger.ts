export enum LogLevel {
	DEBUG,
	LOG,
	INFO,
	WARN,
	ERROR,
	OFF
}

export interface ILogger {
	debug: typeof console.debug;
	log: typeof console.log;
	info: typeof console.info;
	warn: typeof console.warn;
	error: typeof console.error;
}

export class Logger implements ILogger {
	private static readonly LOG_LEVELS: ['debug', 'log', 'info', 'warn', 'error'] = [
		'debug',
		'log',
		'info',
		'warn',
		'error'
	];

	public constructor(private readonly logger: ILogger = console, private level: LogLevel = LogLevel.INFO) {}

	public setLogLevel(level: LogLevel): void {
		this.level = level;
	}

	public debug(message?: unknown, ...optionalParams: any[]): void {
		this.message(LogLevel.DEBUG, message, ...optionalParams);
	}

	public log(message?: unknown, ...optionalParams: any[]): void {
		this.message(LogLevel.LOG, message, ...optionalParams);
	}

	public info(message?: unknown, ...optionalParams: any[]): void {
		this.message(LogLevel.INFO, message, ...optionalParams);
	}

	public warn(message?: unknown, ...optionalParams: any[]): void {
		this.message(LogLevel.WARN, message, ...optionalParams);
	}

	public error(message?: unknown, ...optionalParams: any[]): void {
		this.message(LogLevel.ERROR, message, ...optionalParams);
	}

	private message(level: LogLevel, message?: any, ...optionalParams: any[]): void {
		if (this.level !== LogLevel.OFF && this.level <= level) {
			this.logger[Logger.LOG_LEVELS[level as number]](message, ...optionalParams);
		}
	}
}

export function createLogger(logger: ILogger = console): Logger {
	return new Logger(logger);
}
