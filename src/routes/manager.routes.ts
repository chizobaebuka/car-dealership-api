import express from 'express';
import {
    createManager,
    getManager,
    getCurrentManager,
    getAllManagers,
    updateManager,
    deleteManager
} from '../controllers/manager.controller';
import { validate } from '../middlewares/validate.middleware';
import { managerCreateSchema, managerUpdateSchema } from '../validations/manager.validation';
import { authorizeRoles, protect } from '../middlewares/auth.middleware';


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Managers
 *   description: API for managing managers
 */

router.use(protect)

router.get('/', getAllManagers);
router.post('/', authorizeRoles('admin'), createManager);
router.get('/me', authorizeRoles('admin', 'manager'), getCurrentManager);
router.get('/:id', authorizeRoles('admin', 'manager'), getManager);
router.put('/:id', authorizeRoles('admin'), updateManager);
router.delete('/:id', authorizeRoles('admin'), deleteManager);

export default router;