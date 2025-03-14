import { type } from 'arktype';
import { validate } from './validator';

const registerUserType = type({
    username: 'string',
    firstName: 'string',
    lastName: 'string',
    DOB: 'string.date',
    password: 'string',
    email: 'string.email',
    'phoneNumber?': 'string',
});
export type RegisterUserDTO = typeof registerUserType.infer;
export const validateRegisterUser = validate(registerUserType);

const loginUserType = type({
    'username?': 'string',
    password: 'string',
    'email?': 'string.email',
    'phoneNumber?': 'string',
});
export type LoginUserDTO = typeof loginUserType.infer;
export const validateLoginUser = validate(loginUserType);
