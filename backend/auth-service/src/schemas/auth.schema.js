import { z } from 'zod';

// Register Schema
export const registerSchema = z.object({
    email: z.string().email('Invalid Email'),
    password: z.string().min(8, 'password must have at least 8 characters'),
    name: z.string().min(1, 'the name is required'),
    lastname: z.string().min(1, 'the lastname is required'),
    cellphone: z.string().optional(),
    avatarUrl: z.string().url('Avatar URL invalid').optional()
})