import express from 'express';
import {
    createCustomer,
    getCustomer,
    getCurrentCustomer,
    updateCustomer,
    deleteCustomer,
    getAllCustomers
} from '../controllers/customer.controller';
import { authorizeRoles, protect } from '../middlewares/auth.middleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: API for managing customers
 */

router.get('/me', protect, getCurrentCustomer);
router.post('/', protect, createCustomer);
router.get('/:id', getCustomer);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);
router.get('/', getAllCustomers);

export default router;