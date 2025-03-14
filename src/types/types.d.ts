import { UserType } from '../database/schema/user.schema';

declare module 'bun' {
    interface Env {
        MONGO_URI: string;
        MONGO_DATABASE: string;
        ARTICLE_COLLECTION: string;
        ELASTIC_URI: string;
        BUN_ENV: string;
        BUN_PORT: string;
        PINO_LOG_LEVEL: string;
        ELASTIC_API_KEY: string;
        ELASTIC_USER: string;
        ELASTIC_PASSWORD: string;
        APP_ES_CERT_DIR: String;
        TOKEN_SECRET: string;
    }

    interface BunRequest {
        authUser: UserType; // Add authUser property
    }
}
