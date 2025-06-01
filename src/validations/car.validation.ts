import { z } from 'zod';

export const carCreateSchema = z.object({
    brand: z.string().min(2, "Brand must be at least 2 characters"),
    carModel: z.string().min(1, "Model is required"),
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
    carmodel: z.string().optional(),
    minPrice: z.string().transform(Number).pipe(z.number().min(0)).optional(),
    maxPrice: z.string().transform(Number).pipe(z.number().min(0)).optional(),
    minYear: z.string().transform(Number).pipe(z.number().int().min(1900)).optional(),
    maxYear: z.string().transform(Number).pipe(z.number().int().min(1900)).optional(),
    color: z.string().optional(),
    minMileage: z.string().transform(Number).pipe(z.number().min(0)).optional(),
    maxMileage: z.string().transform(Number).pipe(z.number().min(0)).optional(),
    category: z.string().optional(),
    availability: z
        .string()
        .transform((val) => val === 'true')
        .optional(),
    page: z.string().transform(Number).pipe(z.number().int().min(1)).optional(),
    limit: z.string().transform(Number).pipe(z.number().int().min(1).max(100)).optional(),
    sort: z.string().optional()
});

export type CarCreateInput = z.infer<typeof carCreateSchema>;
export type CarUpdateInput = z.infer<typeof carUpdateSchema>;
export type CarFilterInput = z.infer<typeof carFilterSchema>;