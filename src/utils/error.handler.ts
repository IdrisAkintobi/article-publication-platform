import { BadRequestError, CustomError, InternalServerError } from './custom.errors';
import { logger } from './logger';

interface ErrorResponse {
    success: boolean;
    statusCode: number;
    message: string;
    stack?: string;
}

/**
 * Handles errors, logs them, and returns a formatted response.
 * @param err - The error object
 * @returns ErrorResponse
 */
export const errorHandler = (err: Error): Response => {
    let customError: CustomError;
    const isDev = Bun.env.BUN_ENV === 'development';

    switch (true) {
        case err instanceof CustomError:
            customError = err;
            break;
        case err.message.includes('Unexpected end of JSON input'):
            customError = new BadRequestError('invalid JSON in request body');
            break;
        default:
            customError = new InternalServerError();
    }

    const response: ErrorResponse = {
        success: false,
        statusCode: customError.statusCode,
        message: customError.message,
        ...(isDev && { stack: err.stack }),
    };

    logger.error(err, `[ERROR]: ${err.message}`);

    return Response.json(response, { status: response.statusCode });
};
