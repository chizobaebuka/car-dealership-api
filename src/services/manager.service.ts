import Manager from '../models/manager.model';
import User from '../models/user.model';
import { AppError } from '../utils/appError';
import { ManagerCreateInput, ManagerUpdateInput } from '../validations/manager.validation';
import { paginate } from '../utils/paginate';

class ManagerService {
    async createManager(userId: string, input: ManagerCreateInput) {
        const existingManager = await Manager.findOne({ user: userId });
        if (existingManager) {
            throw new AppError(400, 'Manager profile already exists for this user');
        }

        const manager = await Manager.create({ ...input, user: userId });

        // Update user role to manager
        await User.findByIdAndUpdate(userId, { role: 'manager' });

        return manager;
    }

    async getManagerById(id: string) {
        const manager = await Manager.findById(id).populate('user', 'username email role');
        if (!manager) {
            throw new AppError(404, 'Manager not found');
        }
        return manager;
    }

    async getManagerByUserId(userId: string) {
        const manager = await Manager.findOne({ user: userId }).populate('user', 'username email role');
        if (!manager) {
            throw new AppError(404, 'Manager not found');
        }
        return manager;
    }

    async getAllManagers({ page = 1, limit = 10, sort }: { page: number; limit: number; sort?: string }) {
        const query = {}; // Add any filters if needed

        const [total, managers] = await paginate(Manager, query, {
            page,
            limit,
            sort,
        });

        return {
            data: managers,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit,
            },
        };
    }

    async updateManager(id: string, input: ManagerUpdateInput) {
        const manager = await Manager.findByIdAndUpdate(id, input, {
            new: true,
            runValidators: true
        }).populate('user', 'username email role');

        if (!manager) {
            throw new AppError(404, 'Manager not found');
        }
        return manager;
    }

    async deleteManager(id: string) {
        const manager = await Manager.findByIdAndDelete(id);
        if (!manager) {
            throw new AppError(404, 'Manager not found');
        }

        // Delete associated user
        await User.findByIdAndDelete(manager.user);

        return manager;
    }
}

export default new ManagerService();