import { Request, Response, NextFunction } from 'express';
import customerService from '../services/customer.service';
import { sendResponse } from '../utils/apiResponse';
import { CustomerCreateInput } from '../validations/customer.validation';

export const createCustomer = async (
    req: Request<{}, {}, CustomerCreateInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new Error('User information is missing in the request.');
        }
        const customer = await customerService.createCustomer(req.user._id, req.body);
        sendResponse(res, 201, 'Customer profile created successfully', customer);
    } catch (err) {
        next(err);
    }
};

export const getCustomer = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const customer = await customerService.getCustomerById(req.params.id);
        sendResponse(res, 200, 'Customer retrieved successfully', customer);
    } catch (err) {
        next(err);
    }
};

export const getCurrentCustomer = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new Error('User information is missing in the request.');
        }
        const customer = await customerService.getCustomerByUserId(req.user._id);
        sendResponse(res, 200, 'Customer profile retrieved successfully', customer);
    } catch (err) {
        next(err);
    }
};

export const updateCustomer = async (
    req: Request<{ id: string }, {}, CustomerCreateInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const customer = await customerService.updateCustomer(req.params.id, req.body);
        sendResponse(res, 200, 'Customer updated successfully', customer);
    } catch (err) {
        next(err);
    }
};

export const deleteCustomer = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const customer = await customerService.deleteCustomer(req.params.id);
        sendResponse(res, 200, 'Customer deleted successfully', customer);
    } catch (err) {
        next(err);
    }
};