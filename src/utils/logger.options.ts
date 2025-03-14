import { ecsFormat } from '@elastic/ecs-pino-format';
import { join } from 'path';
import pino, { transport, type LogFn, type LoggerOptions } from 'pino';
import { APP_ENV } from '../types/interfaces';
import { streamToElastic } from './elasticsearch.client';

// This is to ensure typescript only expose these methods
export interface ICustomLogger {
    contextLogger: (context: { module: string; [key: string]: string }) => ICustomLogger;
    debug: LogFn;
    info: LogFn;
    warn: LogFn;
    error: LogFn;
    fatal: LogFn;
}

export type LogParam = Parameters<LogFn['call']>;

// Read elasticsearch tls credentials
let caString = '';
let crtString = '';
let keyString = '';
const tlsCertDir = Bun.env.APP_ES_CERT_DIR;
try {
    [caString, crtString, keyString] = await Promise.all([
        Bun.file(tlsCertDir + '/ca.crt').text(),
        Bun.file(tlsCertDir + '/app.crt').text(),
        Bun.file(tlsCertDir + '/app.key').text(),
    ]);
} catch (error) {}

const baseOptions: LoggerOptions = {
    ...ecsFormat(),
    level: Bun.env.PINO_LOG_LEVEL || 'info',
    enabled: Bun.env.BUN_ENV !== APP_ENV.test,
    redact: {
        paths: ['*.password', '*.email', '*.phoneNumber'],
        censor: '[SENSITIVE]',
        remove: true,
    },
};

const pinoToElastic = () => {
    return pino(baseOptions, streamToElastic);
};

const pinoToFile = () => {
    return pino(
        transport({
            ...baseOptions,
            target: 'pino-roll',
            options: {
                file: join('logs', 'app-log'),
                frequency: 'daily',
                mkdir: true,
                size: '64m',
                extension: '.log',
                limit: { count: 30 },
                dateFormat: 'yyyy-MM-dd',
            },
        }),
    );
};

const pinoToConsole = () => {
    return pino(
        transport({
            target: 'pino-pretty',
            options: { colorize: true, translateTime: 'yyyy-mm-dd HH:MM:ss' },
        }),
    );
};

export function getPinoInstance(env: string) {
    // Added the write method to ensure logTransport suites the DestinationStream type
    switch (env) {
        case 'production':
            return pinoToElastic();

        case 'staging':
            return pinoToFile();

        default:
            return pinoToConsole();
    }
}
