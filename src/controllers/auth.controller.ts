import type { BunRequest, Server } from 'bun';
import { Middleware } from '../middleware/middlewares';
import { AuthService } from '../services/auth.service';
import type { FingerprintData } from '../types/interfaces';
import { validateLoginUser, validateRegisterUser } from '../validators/auth.dto.validator';

export const authController = {
    // Register User
    '/api/auth/register': {
        POST: async (req: BunRequest) => {
            const body = await req.json();
            const userData = validateRegisterUser(body);
            const user = await AuthService.register(userData);
            return Response.json(user);
        },
    },
    // Login User
    '/api/auth/login': {
        POST: async (req: BunRequest, server: Server) => {
            const body = await req.json();
            const userCredentials = validateLoginUser(body);
            const fingerprintData = Middleware.getReqFingerprint(req, server);
            const token = await AuthService.login(userCredentials, fingerprintData as FingerprintData);
            return Response.json(token);
        },
    },
};
