import express from 'express';
import {
    createOrder,
    getOrder,
    getCustomerOrders,
    updateOrder,
    deleteOrder,
    getAllOrders
} from '../controllers/order.controller';
import { authorizeRoles, protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(protect);

router.post('/', authorizeRoles('customer'), createOrder);
router.get('/', authorizeRoles('customer'), getCustomerOrders);
router.get('/', authorizeRoles('customer'), getAllOrders);
router.get('/:id', getOrder);
router.put('/:id', authorizeRoles('manager', 'admin'), updateOrder);
router.delete('/:id', authorizeRoles('manager'), deleteOrder);

export default router;