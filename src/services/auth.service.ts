import User from '../models/user.model';
import { AppError } from '../utils/appError';
import { RegisterInput, LoginInput } from '../validations/auth.validation';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/apiResponse';

class AuthService {
    async register(input: RegisterInput) {
        const existingUser = await User.findOne({
            $or: [{ email: input.email }, { username: input.username }]
        });

        if (existingUser) {
            throw new AppError(400, 'Email or username already exists');
        }

        input.password = await bcrypt.hash(input.password, 12);

        const user = await User.create(input);
        const token = generateToken(user.id);

        return { user, token };
    }

    async login(input: LoginInput) {
        const user = await User.findOne({ email: input.email }).select('+password');
        if (!user) {
            throw new AppError(401, 'Invalid email or password');
        }

        const isMatch = await bcrypt.compare(input.password, user.password);
        if (!isMatch) {
            throw new AppError(401, 'Invalid email or password');
        }

        const token = generateToken(user.id);
        return { user, token };
    }
}

export default new AuthService();