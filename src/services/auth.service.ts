import type { FingerprintData } from '../types/interfaces';
import { BadRequestError } from '../utils/custom.errors';
import type { LoginUserDTO, RegisterUserDTO } from '../validators/auth.dto.validator';
import { CryptoService } from './crypto.service';
import { UserService } from './user.service';

export class AuthService {
    private static loginErrorMessage = 'Invalid credentials';
    // Register user
    public static async register(userData: RegisterUserDTO) {
        const { email, username, phoneNumber } = userData;
        const userExists = await UserService.findUser({ email, username, phoneNumber });
        if (userExists) throw new BadRequestError('User already exist');
        const user = await UserService.createUser(userData);
        return user;
    }

    // Login User
    public static async login(credentials: LoginUserDTO, fingerprintData: FingerprintData) {
        const { email, username, phoneNumber, password } = credentials;
        const user = await UserService.findUser({ email, username, phoneNumber });
        if (!user) throw new BadRequestError(this.loginErrorMessage);
        const passwordIsValid = await CryptoService.comparePassword(password, user.password);
        if (!passwordIsValid) throw new BadRequestError(this.loginErrorMessage);
        const token = CryptoService.createLoginToken({ id: user.id, ...fingerprintData });
        return { token };
    }

    // Update user password
    public static async updatePassword(userId: string, newPassword: string) {
        const passwordHash = await CryptoService.hashPassword(newPassword);
        const user = await UserService.updateUser(userId, { password: passwordHash });
        return user;
    }
}
