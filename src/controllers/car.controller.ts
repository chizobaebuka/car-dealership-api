import { Request, Response, NextFunction } from 'express';
import carService from '../services/car.service';
import { sendResponse } from '../utils/apiResponse';
import { CarCreateInput, CarFilterInput, CarUpdateInput } from '../validations/car.validation';

export const createCar = async (
    req: Request<{}, {}, CarCreateInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const car = await carService.createCar(req.body);
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
        const cars = await carService.getAllCars(req.query);
        sendResponse(res, 200, 'Cars retrieved successfully', cars);
    } catch (err) {
        next(err);
    }
};

export const updateCar = async (
    req: Request<{ id: string }, {}, CarUpdateInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const car = await carService.updateCar(req.params.id, req.body);
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