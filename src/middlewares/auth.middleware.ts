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

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        let token: string | undefined;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            throw new AppError(401, 'Unauthorized: No token provided');
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
            throw new AppError(401, 'Unauthorized: User not found');
        }

        // Attach user to request
        req.user = {
            _id: currentUser._id.toString(),
            email: currentUser.email,
            role: currentUser.role,
        };

        next(); // Explicitly returning void
    } catch (err: any) {
        if (err.name === 'TokenExpiredError') {
            res.status(401).json({
                success: false,
                message: 'Token expired',
            });
            return; // Explicitly returning void
        }
        console.error('Error in protect middleware:', err); // Log the error for debugging
        next(err); // Explicitly returning void
    }
};

export const authorizeRoles = (...roles: Array<'admin' | 'manager' | 'customer'>): (req: Request, res: Response, next: NextFunction) => Promise<void> => {
    return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
        if (!req.user || !roles.includes(req.user.role)) {
            next(new AppError(403, 'You do not have permission to perform this action'));
            return; // Explicitly returning void
        }
        next(); // Explicitly returning void
    };
};