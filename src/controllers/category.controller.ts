import { Request, Response, NextFunction } from 'express';
import categoryService from '../services/category.service';
import { sendResponse } from '../utils/apiResponse';
import { CategoryCreateInput, CategoryUpdateInput } from '../validations/category.validation';

export const createCategory = async (
    req: Request<{}, {}, CategoryCreateInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const category = await categoryService.createCategory(req.body);
        sendResponse(res, 201, 'Category created successfully', category);
    } catch (err) {
        next(err);
    }
};

export const getCategory = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const category = await categoryService.getCategoryById(req.params.id);
        sendResponse(res, 200, 'Category retrieved successfully', category);
    } catch (err) {
        next(err);
    }
};

export const getAllCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const categories = await categoryService.getAllCategories();
        sendResponse(res, 200, 'Categories retrieved successfully', categories);
    } catch (err) {
        next(err);
    }
};

export const updateCategory = async (
    req: Request<{ id: string }, {}, CategoryUpdateInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const category = await categoryService.updateCategory(req.params.id, req.body);
        sendResponse(res, 200, 'Category updated successfully', category);
    } catch (err) {
        next(err);
    }
};

export const deleteCategory = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const category = await categoryService.deleteCategory(req.params.id);
        sendResponse(res, 200, 'Category deleted successfully', category);
    } catch (err) {
        next(err);
    }
};