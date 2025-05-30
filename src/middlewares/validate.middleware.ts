import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { AppError } from '../utils/appError';

export const validate = (schema: AnyZodObject) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params
            });
            next();
        } catch (err) {
            if (err instanceof ZodError) {
                const errorMessages = err.errors.map((e) => ({
                    path: e.path.join('.'),
                    message: e.message
                }));
                next(new AppError(400, `Validation error: ${JSON.stringify(errorMessages)}`));
            } else {
                next(err);
            }
        }
    };