import { User, type UserType } from '../database/schema/user.schema';
import { BadRequestError, NotFoundError } from '../utils/custom.errors';
import { type LoginUserDTO, type RegisterUserDTO } from '../validators/auth.dto.validator';
import { CryptoService } from './crypto.service';

export class UserService {
    // Find user by ID
    public static findUserById = async (userId: string) => {
        const user = await User.findById(userId);
        return user;
    };

    // Find user by email and/or phone number
    public static findUser = async (identifier: Omit<LoginUserDTO, 'password'>) => {
        const { email, phoneNumber, username } = identifier;

        let query: Record<string, string>;
        if (email) {
            query = { email };
        } else if (phoneNumber) {
            query = { phoneNumber };
        } else if (username) {
            query = { username };
        } else {
            throw new BadRequestError('At least one identifier (email, phone number, or username) must be provided');
        }

        const user = await User.findOne(query);
        return user;
    };

    // Create a new user
    public static createUser = async (userData: RegisterUserDTO) => {
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) throw new BadRequestError('User with this email already exists');

        const hashedPassword = await CryptoService.hashPassword(userData.password);
        userData.password = hashedPassword;
        const newUser = new User(userData);
        return (await newUser.save()) as UserType;
    };

    // Update user details
    public static updateUser = async (userId: string, updateData: Partial<UserType>) => {
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
            new: true,
            runValidators: true,
            lean: true,
        });
        if (!updatedUser) throw new NotFoundError('User not found');
        return updatedUser as UserType;
    };

    // Delete a user
    public static deleteUser = async (userId: string) => {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) throw new NotFoundError('User not found');
    };

    // Get users with pagination
    public static getUsers = async (filter = {}, page: number = 1, limit: number = 10) => {
        const skip = (page - 1) * limit; // Calculate how many documents to skip

        const users = await User.find(filter).skip(skip).limit(limit);

        const totalUsers = await User.countDocuments(filter); // Get total count

        return {
            users,
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page,
        };
    };
}
