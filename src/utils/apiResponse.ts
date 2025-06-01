import { Response } from 'express';
import jwt from 'jsonwebtoken';

type ResponseData = {
    success: boolean;
    message: string;
    data?: any;
    pagination?: {
        total: number;
        page: number;
        pages: number;
        limit: number;
    };
};

export const sendResponse = (
    res: Response,
    statusCode: number,
    message: string,
    data?: any,
    pagination?: {
        total: number;
        page: number;
        pages: number;
        limit: number;
    }
) => {
    const response: ResponseData = {
        success: statusCode < 400,
        message,
        data
    };

    if (pagination) {
        response.pagination = pagination;
    }

    res.status(statusCode).json(response);
};

export const generateToken = (userId: string) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
        expiresIn: '7d' // Extend expiration time to 7 days
    });
};