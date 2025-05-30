import { z } from 'zod';

export const managerCreateSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    phone: z.string().min(10, "Phone must be at least 10 characters"),
    department: z.string().optional(),
    hireDate: z.date().optional()
});

export const managerUpdateSchema = managerCreateSchema.partial();

export type ManagerCreateInput = z.infer<typeof managerCreateSchema>;
export type ManagerUpdateInput = z.infer<typeof managerUpdateSchema>;