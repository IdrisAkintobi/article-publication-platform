export const APP_ENV = {
    dev: 'development',
    staging: 'staging',
    test: 'test',
    qa: 'qa',
    prod: 'production',
} as const;

export type APP_ENV_ENUM = (typeof APP_ENV)[keyof typeof APP_ENV];

export type TokenPayload = { id: string; ip: string; userAgent: string };

export type FingerprintData = { ip: string; userAgent: string };
