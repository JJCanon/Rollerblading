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

// Login Schema
export const loginSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(1, 'the password is required'),
});

// Refresh Token Schema
export const refreshSchema = z.object({
    refreshToken: z.string().min(1, 'Refresh token is required')
});

// Logout Schema
export const logoutSchema = z.object({
    refreshToken: z.string().min(1, 'Refresh token is required')
});