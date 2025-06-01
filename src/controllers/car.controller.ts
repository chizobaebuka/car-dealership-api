import { Request, Response, NextFunction } from 'express';
import carService from '../services/car.service';
import { sendResponse } from '../utils/apiResponse';
import { CarCreateInput, carCreateSchema, CarFilterInput, carFilterSchema, CarUpdateInput, carUpdateSchema } from '../validations/car.validation';
import { ParsedQs } from 'qs';

export const createCar = async (
    req: Request<{}, {}, CarCreateInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const validatedData = carCreateSchema.safeParse(req.body);
        if (!validatedData.success) {
            res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: validatedData.error.errors.map(err => err.message)
            });
            console.log(validatedData.error.format());
            return;
        }

        const car = await carService.createCar(validatedData.data);
        sendResponse(res, 201, 'Car created successfully', car);
    } catch (err) {
        next(err);
    }
};

export const getCar = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const car = await carService.getCarById(req.params.id);
        sendResponse(res, 200, 'Car retrieved successfully', car);
    } catch (err) {
        next(err);
    }
};


export const getAllCars = async (
    req: Request<{}, {}, {}, CarFilterInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const validatedQuery = carFilterSchema.safeParse(req.query);
        console.log({ validatedQuery });
        if (!validatedQuery.success) {
            res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: validatedQuery.error.errors.map(err => err.message)
            });
            return;
        }

        const parsedQuery = validatedQuery.data;
        const { page, limit, sort, ...filters } = parsedQuery;

        const cars = await carService.getAllCars({
            ...filters,
            page,
            limit,
            sort,
        });

        sendResponse(res, 200, 'Cars retrieved successfully', cars);
    } catch (err) {
        console.error('Error in getAllCars:', err); // Log the error for debugging
        next(err);
    }
};

export const updateCar = async (
    req: Request<{ id: string }, {}, CarUpdateInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const validatedData = carUpdateSchema.safeParse(req.body);
        if (!validatedData.success) {
            res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: validatedData.error.errors.map(err => err.message)
            });
            return;
        }

        const car = await carService.updateCar(req.params.id, validatedData.data);
        sendResponse(res, 200, 'Car updated successfully', car);
    } catch (err) {
        next(err);
    }
};

export const deleteCar = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const car = await carService.deleteCar(req.params.id);
        sendResponse(res, 200, 'Car deleted successfully', car);
    } catch (err) {
        next(err);
    }
};