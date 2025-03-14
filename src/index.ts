import * as mongoose from 'mongoose';
import { articleController } from './controllers/article.controller';
import { authController } from './controllers/auth.controller';
import { healthController } from './controllers/health.controller';
import { userController } from './controllers/user.controller';
import { errorHandler } from './utils/error.handler';

// connect to database
await mongoose.connect(Bun.env.MONGO_URI);

const server = Bun.serve({
    routes: {
        ...healthController,
        ...articleController,
        ...userController,
        ...authController,

        '/*': Response.json({ message: 'Route not found' }, { status: 404 }),
    },

    // Global error handler
    error(error) {
        return errorHandler(error);
    },
});

console.log(`Server started on ${server.url}`);
