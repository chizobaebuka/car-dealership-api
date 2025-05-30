import { Request, Response, NextFunction } from 'express';
import managerService from '../services/manager.service';
import { sendResponse } from '../utils/apiResponse';
import { ManagerCreateInput } from '../validations/manager.validation';
import { ManagerUpdateInput } from '../validations/manager.validation';

export const createManager = async (
    req: Request<{}, {}, ManagerCreateInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new Error('User information is missing in the request');
        }
        const manager = await managerService.createManager(req.user._id, req.body);
        sendResponse(res, 201, 'Manager profile created successfully', manager);
    } catch (err) {
        next(err);
    }
};

export const getManager = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const manager = await managerService.getManagerById(req.params.id);
        sendResponse(res, 200, 'Manager retrieved successfully', manager);
    } catch (err) {
        next(err);
    }
};

export const getCurrentManager = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new Error('User information is missing in the request');
        }
        const manager = await managerService.getManagerByUserId(req.user._id);
        sendResponse(res, 200, 'Manager profile retrieved successfully', manager);
    } catch (err) {
        next(err);
    }
};

export const getAllManagers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const managers = await managerService.getAllManagers();
        sendResponse(res, 200, 'Managers retrieved successfully', managers);
    } catch (err) {
        next(err);
    }
};

export const updateManager = async (
    req: Request<{ id: string }, {}, ManagerUpdateInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const manager = await managerService.updateManager(req.params.id, req.body);
        sendResponse(res, 200, 'Manager updated successfully', manager);
    } catch (err) {
        next(err);
    }
};

export const deleteManager = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const manager = await managerService.deleteManager(req.params.id);
        sendResponse(res, 200, 'Manager deleted successfully', manager);
    } catch (err) {
        next(err);
    }
};