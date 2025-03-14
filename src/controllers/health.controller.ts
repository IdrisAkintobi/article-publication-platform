import { version } from '../../package.json';

const healthController = {
    // Health checks
    '/health': new Response('OK'),

    // API status
    '/api/status': Response.json(
        {
            status: 'running',
            version,
            bunVersion: Bun.version,
            env: Bun.env.BUN_ENV,
            message: `Application running on port ${Bun.env.BUN_PORT}`,
        },
        {
            headers: {
                'X-Status': 'running',
            },
        },
    ),
};

export { healthController };
