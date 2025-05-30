import { z } from 'zod';

export const carCreateSchema = z.object({
    brand: z.string().min(2, "Brand must be at least 2 characters"),
    model: z.string().min(1, "Model is required"),
    year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
    price: z.number().min(0, "Price must be positive"),
    color: z.string().optional(),
    mileage: z.number().min(0).optional(),
    category: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID"),
    features: z.array(z.string()).optional(),
    availability: z.boolean().optional()
});

export const carUpdateSchema = carCreateSchema.partial();

export const carFilterSchema = z.object({
    brand: z.string().optional(),
    model: z.string().optional(),
    minPrice: z.number().min(0).optional(),
    maxPrice: z.number().min(0).optional(),
    minYear: z.number().int().min(1900).optional(),
    maxYear: z.number().int().min(1900).optional(),
    color: z.string().optional(),
    minMileage: z.number().min(0).optional(),
    maxMileage: z.number().min(0).optional(),
    category: z.string().optional(),
    availability: z.boolean().optional(),
    page: z.number().int().min(1).optional().default(1),
    limit: z.number().int().min(1).max(100).optional().default(10),
    sort: z.string().optional()
});

export type CarCreateInput = z.infer<typeof carCreateSchema>;
export type CarUpdateInput = z.infer<typeof carUpdateSchema>;
export type CarFilterInput = z.infer<typeof carFilterSchema>;