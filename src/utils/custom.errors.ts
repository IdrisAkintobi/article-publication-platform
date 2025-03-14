export class CustomError extends Error {
    public statusCode: number;
    public isCustom: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isCustom = true; // Flag to identify custom errors
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class BadRequestError extends CustomError {
    constructor(message: string = 'Bad Request') {
        super(message, 400);
    }
}

export class ValidationError extends CustomError {
    constructor(message: string = 'Validation Error') {
        super(message, 400);
    }
}

export class NotFoundError extends CustomError {
    constructor(message: string = 'Not Found') {
        super(message, 404);
    }
}

export class UnauthorizedError extends CustomError {
    constructor(message: string = 'Unauthorized') {
        super(message, 401);
    }
}

export class ForbiddenError extends CustomError {
    constructor(message: string = 'Forbidden') {
        super(message, 403);
    }
}

export class ConflictError extends CustomError {
    constructor(message: string = 'Conflict') {
        super(message, 409);
    }
}

export class InternalServerError extends CustomError {
    constructor(message: string = 'Internal Server Error') {
        super(message, 500);
    }
}
