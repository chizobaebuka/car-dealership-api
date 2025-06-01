import { z } from 'zod';

export const orderCreateSchema = z.object({
    car: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid car ID"),
    manager: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid manager ID").optional(),
    price: z.number().min(0, "Price must be positive"),
    paymentMethod: z.enum(['cash', 'credit', 'finance'])
});

export const orderUpdateSchema = z.object({
    manager: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid manager ID").optional(),
    status: z.enum(['pending', 'completed', 'cancelled']).optional()
});

export const orderFilterSchema = z.object({
    customer: z.string().optional(),
    car: z.string().optional(),
    manager: z.string().optional(),
    status: z.enum(['pending', 'completed', 'cancelled']).optional(),
    page: z.number().int().min(1).optional().default(1),
    limit: z.number().int().min(1).max(100).optional().default(10),
    sort: z.string().optional()
});

export type OrderCreateInput = z.infer<typeof orderCreateSchema>;
export type OrderUpdateInput = z.infer<typeof orderUpdateSchema>;
export type OrderFilterInput = z.infer<typeof orderFilterSchema>;