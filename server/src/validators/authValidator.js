import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').optional(),
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters').optional(),
  email: z.string().trim().email('Invalid email address').toLowerCase(),
  phone: z.string().trim().optional().or(z.literal('')),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.preprocess(
    (val) => (typeof val === 'string' ? val.toUpperCase() : val),
    z.enum(['RENTER', 'OWNER'], {
      errorMap: () => ({ message: 'Role must be either RENTER or OWNER' })
    })
  )
}).refine((data) => data.name || data.fullName, {
  message: 'Name is required',
  path: ['name']
});

export const verifyEmailSchema = z.object({
  email: z.string().trim().email('Invalid email address').toLowerCase(),
  otp: z.string().trim().length(6, 'OTP must be exactly 6 digits').regex(/^\d{6}$/, 'OTP must contain numbers only')
});

export const resendOtpSchema = z.object({
  email: z.string().trim().email('Invalid email address').toLowerCase()
});

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required')
});
