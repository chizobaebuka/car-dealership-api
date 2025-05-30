import Order from '../models/order.model';
import Car from '../models/car.model';
import Customer from '../models/customer.model';
import Manager from '../models/manager.model';
import { AppError } from '../utils/appError';
import { OrderCreateInput, OrderUpdateInput } from '../validations/order.validation';

class OrderService {
    async createOrder(customerId: string, input: OrderCreateInput) {
        const car = await Car.findById(input.car);
        if (!car) {
            throw new AppError(404, 'Car not found');
        }

        if (!car.availability) {
            throw new AppError(400, 'Car is not available');
        }

        if (input.manager) {
            const manager = await Manager.findById(input.manager);
            if (!manager) {
                throw new AppError(404, 'Manager not found');
            }
        }

        const order = await Order.create({
            ...input,
            customer: customerId,
            price: car.price
        });

        // Update car availability
        car.availability = false;
        await car.save();

        return order;
    }

    async getOrderById(id: string) {
        const order = await Order.findById(id)
            .populate('customer')
            .populate('car')
            .populate('manager');

        if (!order) {
            throw new AppError(404, 'Order not found');
        }
        return order;
    }

    async getCustomerOrders(customerId: string) {
        return Order.find({ customer: customerId })
            .populate('car')
            .populate('manager');
    }

    async updateOrder(id: string, input: OrderUpdateInput) {
        const order = await Order.findByIdAndUpdate(id, input, {
            new: true,
            runValidators: true
        })
            .populate('customer')
            .populate('car')
            .populate('manager');

        if (!order) {
            throw new AppError(404, 'Order not found');
        }
        return order;
    }

    async deleteOrder(id: string) {
        const order = await Order.findByIdAndDelete(id);
        if (!order) {
            throw new AppError(404, 'Order not found');
        }

        // Update car availability
        await Car.findByIdAndUpdate(order.car, { availability: true });

        return order;
    }
}

export default new OrderService();