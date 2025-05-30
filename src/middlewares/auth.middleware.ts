import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AppError } from '../utils/appError';
import userModel from '../models/user.model';

// Extend Express request interface
declare global {
    namespace Express {
        interface Request {
            user?: {
                _id: string;
                email: string;
                role: 'customer' | 'manager' | 'admin';
            };
        }
    }
}

export const protect = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let token: string | undefined;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(
                new AppError(401, 'You are not logged in! Please log in to get access.')
            );
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        // Check if user still exists
        const currentUser = await userModel.findById(decoded.id).select('_id email role') as {
            _id: string;
            email: string;
            role: 'customer' | 'manager' | 'admin';
        };

        if (!currentUser) {
            return next(
                new AppError(
                    401,
                    'The user belonging to this token no longer exists.'
                )
            );
        }

        // Attach user to request
        req.user = {
            _id: currentUser._id.toString(),
            email: currentUser.email,
            role: currentUser.role,
        };

        next();
    } catch (err) {
        next(err);
    }
};

export const authorizeRoles = (...roles: Array<'admin' | 'manager' | 'customer'>) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(
                new AppError(403, 'You do not have permission to perform this action')
            );
        }
        next();
    };
};