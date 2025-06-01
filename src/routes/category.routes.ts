import express from 'express';
import {
    createCategory,
    getCategory,
    getAllCategories,
    updateCategory,
    deleteCategory
} from '../controllers/category.controller';
import { authorizeRoles, protect } from '../middlewares/auth.middleware';


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API for managing categories
 */

router.use(protect);

router.post('/', authorizeRoles('manager'), createCategory);
router.get('/', getAllCategories);
router.get('/:id', getCategory);
router.put('/:id', authorizeRoles('admin', 'manager'), updateCategory);
router.delete('/:id', authorizeRoles('admin', 'manager'), deleteCategory);

export default router;