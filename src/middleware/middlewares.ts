import { type BunRequest, type Server } from 'bun';
import { CryptoService } from '../services/crypto.service';
import { UserService } from '../services/user.service';
import { UnauthorizedError } from '../utils/custom.errors';

export class Middleware {
    public static getReqFingerprint(req: BunRequest, server: Server) {
        const ip = server.requestIP(req)?.address;
        const userAgent = req.headers.get('User-Agent');
        return { ip, userAgent };
    }

    public static async authenticate(req: BunRequest, server: Server) {
        const authHeader = req.headers.get('Authorization');
        const token = authHeader?.split('Bearer ')[1];
        if (!token) throw new UnauthorizedError();

        const { ip, userAgent } = this.getReqFingerprint(req, server);
        const payload = CryptoService.decodeLoginToken(token);
        if (payload.ip !== ip || payload.userAgent !== userAgent) {
            throw new UnauthorizedError();
        }

        // We can make use of some caching here to avoid hitting the db on every auth request
        const authUser = await UserService.findUserById(payload.id);
        if (!authUser) throw new UnauthorizedError();
        // BunRequest interface updated at types/types.d.ts
        req.authUser = authUser;
    }
}
