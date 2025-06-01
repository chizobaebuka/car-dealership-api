import { Request, Response, NextFunction } from 'express';
import customerService from '../services/customer.service';
import { sendResponse } from '../utils/apiResponse';
import { CustomerCreateInput, customerCreateSchema, customerUpdateSchema } from '../validations/customer.validation';
import { CustomerFilterInput, customerFilterSchema } from '../validations/customer.validation'
import { AppError } from '../utils/appError';
export const createCustomer = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new AppError(401, 'Unauthorized: User information is missing in the request.');
        }

        const validData = customerCreateSchema.safeParse(req.body);
        if (!validData.success) {
            res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: validData.error.errors.map(err => err.message)
            });
            return;
        }

        const customer = await customerService.createCustomer(req.user._id, validData.data);
        sendResponse(res, 201, 'Customer profile created successfully', customer);
    } catch (err) {
        console.error('Error in createCustomer:', err); // Log the error for debugging
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

export const getAllCustomers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const validatedQuery = customerFilterSchema.safeParse(req.query);
        if (!validatedQuery.success) {
            res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: validatedQuery.error.errors.map(err => err.message)
            });
            return;
        }

        const parsedQuery = validatedQuery.data;
        const customers = await customerService.getAllCustomers(parsedQuery);

        sendResponse(res, 200, 'Customers retrieved successfully', customers);
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
        const validatedData = customerUpdateSchema.safeParse(req.body);
        if (!validatedData.success) {
            res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: validatedData.error.errors.map(err => err.message)
            });
            return;
        }
        const customer = await customerService.updateCustomer(req.params.id, validatedData.data);
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