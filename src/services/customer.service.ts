import Customer from '../models/customer.model';
import User from '../models/user.model';
import { AppError } from '../utils/appError';
import { CustomerCreateInput, CustomerUpdateInput } from '../validations/customer.validation';

class CustomerService {
    async createCustomer(userId: string, input: CustomerCreateInput) {
        const existingCustomer = await Customer.findOne({ user: userId });
        if (existingCustomer) {
            throw new AppError(400, 'Customer profile already exists for this user');
        }

        const customer = await Customer.create({ ...input, user: userId });
        return customer;
    }

    async getCustomerById(id: string) {
        const customer = await Customer.findById(id).populate('user', 'username email role');
        if (!customer) {
            throw new AppError(404, 'Customer not found');
        }
        return customer;
    }

    async getCustomerByUserId(userId: string) {
        const customer = await Customer.findOne({ user: userId }).populate('user', 'username email role');
        if (!customer) {
            throw new AppError(404, 'Customer not found');
        }
        return customer;
    }

    async updateCustomer(id: string, input: CustomerUpdateInput) {
        const customer = await Customer.findByIdAndUpdate(id, input, {
            new: true,
            runValidators: true
        }).populate('user', 'username email role');

        if (!customer) {
            throw new AppError(404, 'Customer not found');
        }
        return customer;
    }

    async deleteCustomer(id: string) {
        const customer = await Customer.findByIdAndDelete(id);
        if (!customer) {
            throw new AppError(404, 'Customer not found');
        }

        // Delete associated user
        await User.findByIdAndDelete(customer.user);

        return customer;
    }
}

export default new CustomerService();