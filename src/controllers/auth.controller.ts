import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { sendResponse } from '../utils/apiResponse';
import { RegisterInput, LoginInput, registerSchema, loginSchema } from '../validations/auth.validation';

export const register = async (
    req: Request<{}, {}, RegisterInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const validatedData = registerSchema.safeParse(req.body);
        if (!validatedData.success) {
            res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: validatedData.error.errors.map(err => err.message)
            });
            return;
        }
        const { user, token } = await authService.register(req.body);
        sendResponse(res, 201, 'User registered successfully', { user, token });
    } catch (err) {
        next(err);
    }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const validatedData = loginSchema.safeParse(req.body);
        if (!validatedData.success) {
            res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: validatedData.error.errors.map(err => err.message)
            });
            return;
        }

        const { user, token } = await authService.login(validatedData.data);
        sendResponse(res, 200, 'Login successful', { user, token });
    } catch (err) {
        next(err);
    }
};

