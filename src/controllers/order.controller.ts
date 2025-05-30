import { Request, Response, NextFunction } from 'express';
import orderService from '../services/order.service';
import { sendResponse } from '../utils/apiResponse';
import { OrderCreateInput, OrderUpdateInput } from '../validations/order.validation';
import { AppError } from '../utils/appError';

export const createOrder = async (
    req: Request<{}, {}, OrderCreateInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const customerId = req.user?.role === 'customer' ? req.user?._id : undefined;
        if (!customerId) {
            throw new AppError(403, 'Only customers can create orders');
        }

        const order = await orderService.createOrder(customerId, req.body);
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
    req: Request<{ id: string }, {}, OrderUpdateInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const order = await orderService.updateOrder(req.params.id, req.body);
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