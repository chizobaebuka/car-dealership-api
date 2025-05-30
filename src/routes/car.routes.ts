import express from 'express';
import {
    createCar,
    getCar,
    getAllCars,
    updateCar,
    deleteCar
} from '../controllers/car.controller';
import { validate } from '../middlewares/validate.middleware';
import { protect, authorizeRoles } from '../middlewares/auth.middleware';
import { carCreateSchema, carFilterSchema, carUpdateSchema } from '../validations/car.validation';

const router = express.Router();

router.get('/', validate(carFilterSchema), getAllCars as unknown as express.RequestHandler);
router.post('/', protect, authorizeRoles('manager', 'admin'), validate(carCreateSchema), createCar);
router.get('/:id', validate(carFilterSchema), getCar);
router.put('/:id', protect, authorizeRoles('manager', 'admin'), validate(carUpdateSchema), updateCar);
router.delete('/:id', protect, authorizeRoles('admin'), deleteCar);

export default router;