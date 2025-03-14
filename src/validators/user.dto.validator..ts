import { type } from 'arktype';
import { mongoIDType, validate } from './validator';

const userIdType = type({
    userId: mongoIDType,
});
export const validateUserId = validate(userIdType);
