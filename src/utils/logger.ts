import { type Logger } from 'pino';
import { getPinoInstance, type ICustomLogger, type LogParam } from './logger.options';

// Create base logger instance
class AppLogger implements ICustomLogger {
    private logger: Logger;

    constructor(logger?: Logger) {
        this.logger = logger || getPinoInstance(Bun.env.BUN_ENV);
    }

    contextLogger(context: Record<string, unknown>): ICustomLogger {
        return new AppLogger(this.logger.child(context));
    }

    debug(...logParam: LogParam): void {
        this.logger.debug(...logParam);
    }

    info(...logParam: LogParam): void {
        this.logger.info(...logParam);
    }

    warn(...logParam: LogParam): void {
        this.logger.warn(...logParam);
    }

    error(...logParam: LogParam): void {
        this.logger.error(...logParam);
    }

    fatal(...logParam: LogParam): void {
        this.logger.fatal(...logParam);
    }
}

export const logger = new AppLogger();
