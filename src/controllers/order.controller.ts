import { Request, Response, NextFunction } from 'express';
import orderService from '../services/order.service';
import { sendResponse } from '../utils/apiResponse';
import { orderCreateSchema, orderFilterSchema, OrderUpdateInput, orderUpdateSchema } from '../validations/order.validation';
import { AppError } from '../utils/appError';

export const createOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const customerId = req.user?.role === 'customer' ? req.user?._id : undefined;
        if (!customerId) {
            throw new AppError(403, 'Only customers can create orders');
        }
        const validatedData = orderCreateSchema.safeParse(req.body);
        if (!validatedData.success) {
            res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: validatedData.error.errors.map(err => err.message)
            });
            return;
        }
        const order = await orderService.createOrder(customerId, validatedData.data);
        sendResponse(res, 201, 'Order created successfully', order);
    } catch (err) {
        next(err);
    }
};

export const getOrder = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const order = await orderService.getOrderById(req.params.id);
        sendResponse(res, 200, 'Order retrieved successfully', order);
    } catch (err) {
        next(err);
    }
};

export const getAllOrders = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const validatedQuery = orderFilterSchema.safeParse(req.query);
        if (!validatedQuery.success) {
            res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: validatedQuery.error.errors.map(err => err.message)
            });
            return;
        }
        const orders = await orderService.getAllOrders(validatedQuery.data);
        sendResponse(res, 200, 'Orders retrieved successfully', orders);
    } catch (error) {
        console.error('Error in getAllOrders:', error);
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                status: 'error',
                message: error.message,
            });
        } else {
            res.status(500).json({
                status: 'error',
                message: 'Internal Server Error',
            });
        }
        next(error);
    }
}

export const getCustomerOrders = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const customerId = req.user?.role === 'customer' ? req.user?._id : undefined;
        if (!customerId) {
            throw new AppError(403, 'Only customers can view their orders');
        }

        const orders = await orderService.getCustomerOrders(customerId);
        sendResponse(res, 200, 'Orders retrieved successfully', orders);
    } catch (err) {
        next(err);
    }
};

export const updateOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const validatedData = orderUpdateSchema.safeParse(req.body);
        if (!validatedData.success) {
            res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: validatedData.error.errors.map(err => err.message)
            });
            return;
        }
        const order = await orderService.updateOrder(req.params.id, validatedData.data);
        sendResponse(res, 200, 'Order updated successfully', order);
    } catch (err) {
        next(err);
    }
};

export const deleteOrder = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const order = await orderService.deleteOrder(req.params.id);
        sendResponse(res, 200, 'Order deleted successfully', order);
    } catch (err) {
        next(err);
    }
};