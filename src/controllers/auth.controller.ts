import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { sendResponse } from '../utils/apiResponse';
import { RegisterInput, LoginInput } from '../validations/auth.validation';

export const register = async (
    req: Request<{}, {}, RegisterInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { user, token } = await authService.register(req.body);
        sendResponse(res, 201, 'User registered successfully', { user, token });
    } catch (err) {
        next(err);
    }
};

export const login = async (
    req: Request<{}, {}, LoginInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { user, token } = await authService.login(req.body);
        sendResponse(res, 200, 'Login successful', { user, token });
    } catch (err) {
        next(err);
    }
};

