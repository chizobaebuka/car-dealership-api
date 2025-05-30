
import carModel from '../models/car.model';
import { AppError } from '../utils/appError';
import { paginate } from '../utils/paginate';
import { CarFilterInput, carFilterSchema } from '../validations/car.validation';

class CarService {
    async createCar(input: any) {
        const car = await carModel.create(input);
        return car;
    }

    async getCarById(id: string) {
        const car = await carModel.findById(id).populate('category');
        if (!car) {
            throw new AppError(404, 'Car not found');
        }
        return car;
    }

    async getAllCars(filter: CarFilterInput) {
        const { page = 1, limit = 10, sort, ...query } = carFilterSchema.parse(filter); // Validate and parse filter

        const [total, cars] = await paginate(carModel, query, {
            page,
            limit,
            sort
        });

        return {
            cars,
            total,
            page,
            pages: Math.ceil(total / limit),
            limit
        };
    }
    async updateCar(id: string, input: any) {
        const car = await carModel.findByIdAndUpdate(id, input, {
            new: true,
            runValidators: true
        }).populate('category');

        if (!car) {
            throw new AppError(404, 'Car not found');
        }
        return car;
    }

    async deleteCar(id: string) {
        const car = await carModel.findByIdAndDelete(id);
        if (!car) {
            throw new AppError(404, 'Car not found');
        }
        return car;
    }
}

export default new CarService();