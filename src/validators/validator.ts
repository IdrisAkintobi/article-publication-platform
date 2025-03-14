import { Type, type } from 'arktype';
import { ValidationError } from '../utils/custom.errors';

export const mongoIDType = type(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i).describe('a valid id');

export function validate<T>(typeSchema: Type<T>, errorMessage?: string) {
    return (payload: Record<string, unknown>): T => {
        const value = typeSchema(payload);
        if (value instanceof type.errors) {
            throw new ValidationError(errorMessage || value.summary);
        }
        return value as T;
    };
}
