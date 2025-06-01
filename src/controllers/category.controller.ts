import { Request, Response, NextFunction } from 'express';
import categoryService from '../services/category.service';
import { sendResponse } from '../utils/apiResponse';
import { CategoryCreateInput, categoryCreateSchema, CategoryUpdateInput, categoryUpdateSchema } from '../validations/category.validation';

export const createCategory = async (
    req: Request<{}, {}, CategoryCreateInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const validatedData = categoryCreateSchema.safeParse(req.body);
        if (!validatedData.success) {
            res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: validatedData.error.errors.map(err => err.message)
            });
            return;
        }

        const category = await categoryService.createCategory(validatedData.data);
        if (!category) {
            res.status(400).json({
                status: 'error',
                message: 'Category creation failed',
                errors: ['Category with this name already exists']
            });
            return;
        }
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
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const sort = req.query.sort as string;
        const fields = req.query.fields as string;

        const { categories, total } = await categoryService.getAllCategories({
            page,
            limit,
            sort,
            fields,
            ...req.query, // pass along additional filters if needed
        });

        const pages = Math.ceil(total / limit);

        sendResponse(res, 200, 'Categories retrieved successfully', categories, {
            total,
            page,
            pages,
            limit,
        });
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
        const validatedData = categoryUpdateSchema.safeParse(req.body);
        if (!validatedData.success) {
            res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: validatedData.error.errors.map(err => err.message)
            });
            return;
        }

        const category = await categoryService.updateCategory(req.params.id, validatedData.data);
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