import type { BunRequest, Server } from 'bun';
import { Middleware } from '../middleware/middlewares';
import { UserService } from '../services/user.service';
import { NotFoundError } from '../utils/custom.errors';
import { validateUserId } from '../validators/user.dto.validator.';

const userController = {
    // Get authenticated user (protected)
    '/api/user/whoami': {
        GET: async (req: BunRequest, server: Server) => {
            await Middleware.authenticate(req, server);
            return Response.json(req.authUser);
        },
    },
    // Get user by Id
    '/api/user/:userId': {
        GET: async (req: BunRequest<'/api/user/:userId'>) => {
            const { userId } = validateUserId({ userId: req.params.userId });
            const user = await UserService.findUserById(userId);
            if (!user) throw new NotFoundError('User not found');
            return Response.json(user);
        },
    },
};

export { userController };
