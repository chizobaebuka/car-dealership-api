import express from 'express';
import authRoutes from './auth.routes';
import carRoutes from './car.routes';
import categoryRoutes from './category.routes';
import customerRoutes from './customer.routes';
import managerRoutes from './manager.routes';
import orderRoutes from './order.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/cars', carRoutes);
router.use('/categories', categoryRoutes);
router.use('/customers', customerRoutes);
router.use('/managers', managerRoutes);
router.use('/orders', orderRoutes);

export default router;