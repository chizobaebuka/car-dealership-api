import express from 'express';
import {
    createCar,
    getCar,
    getAllCars,
    updateCar,
    deleteCar
} from '../controllers/car.controller';
import { protect, authorizeRoles } from '../middlewares/auth.middleware';
/**
 * @swagger
 * tags:
 *   name: Cars
 *   description: API for managing cars
 */

const router = express.Router();

router.use(protect);

router.get('/', getAllCars);
router.post('/', authorizeRoles('admin', 'manager'), createCar);
router.get('/:id', getCar);
router.put('/:id', authorizeRoles('admin', 'manager'), updateCar);
router.delete('/:id', authorizeRoles('admin', 'manager'), deleteCar);

export default router;