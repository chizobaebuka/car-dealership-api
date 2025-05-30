import { z } from 'zod';

export const categoryCreateSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().optional()
});

export const categoryUpdateSchema = categoryCreateSchema.partial();

export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;