
import carModel from '../models/car.model';
import categoryModel from '../models/category.model';
import { AppError } from '../utils/appError';
import { paginate } from '../utils/paginate';
import { CategoryUpdateInput } from '../validations/category.validation';

class CategoryService {
    async createCategory(input: any) {
        const existingCategory = await categoryModel.findOne({ name: input.name });
        if (existingCategory) {
            throw new AppError(400, 'Category with this name already exists');
        }

        const category = await categoryModel.create(input);
        return category;
    }

    async getCategoryById(id: string) {
        const category = await categoryModel.findById(id);
        if (!category) {
            throw new AppError(404, 'Category not found');
        }
        return category;
    }

    async getAllCategories(options: {
        page?: number;
        limit?: number;
        sort?: string;
        fields?: string;
        [key: string]: any;
    }) {
        const [total, categories] = await paginate(categoryModel, {}, options);
        return { total, categories };
    }

    async updateCategory(id: string, input: CategoryUpdateInput) {
        const category = await categoryModel.findByIdAndUpdate(id, input, {
            new: true,
            runValidators: true
        });

        if (!category) {
            throw new AppError(404, 'Category not found');
        }
        return category;
    }

    async deleteCategory(id: string) {
        const category = await categoryModel.findByIdAndDelete(id);
        if (!category) {
            throw new AppError(404, 'Category not found');
        }

        // Remove category reference from cars
        await carModel.updateMany(
            { category: id },
            { $unset: { category: "" } }
        );

        return category;
    }
}

export default new CategoryService();