import { decrypt, encrypt } from 'paseto-ts/v4';
import { type TokenPayload } from '../types/interfaces';
import { UnauthorizedError } from '../utils/custom.errors';
import { logger } from '../utils/logger';
import type { ICustomLogger } from '../utils/logger.options';

export class CryptoService {
    private static tokenSecret = Bun.env.TOKEN_SECRET;
    private static logger: ICustomLogger;

    static {
        this.logger = logger.contextLogger({ module: this.name });
    }

    // Create token
    public static createLoginToken(payload: TokenPayload) {
        return encrypt(this.tokenSecret, { ...payload, exp: '1 hour' }, { addExp: true }); // Token will expire in 1 hour
    }

    // Decode token
    public static decodeLoginToken(token: string) {
        try {
            return decrypt(this.tokenSecret, token).payload as TokenPayload;
        } catch (error) {
            this.logger.error(error, 'Error decoding login token');
            throw new UnauthorizedError();
        }
    }

    public static async hashPassword(password: string) {
        return await Bun.password.hash(password);
    }

    public static async comparePassword(password: string, hash: string) {
        return await Bun.password.verify(password, hash);
    }
}
