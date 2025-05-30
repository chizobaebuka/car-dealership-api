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

export const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRES_IN ? parseInt(process.env.JWT_EXPIRES_IN, 10) : undefined
    });
}