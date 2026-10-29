import { z } from 'zod';

export const createListingSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(150, 'Title must not exceed 150 characters'),
  description: z.string().trim().min(10, 'Description must be at least 10 characters'),
  categoryId: z.string().trim().min(1, 'Category is required'),
  pricePerDay: z.coerce.number().positive('Daily rental price must be greater than 0'),
  depositAmount: z.coerce.number().nonnegative('Security deposit cannot be negative'),
  area: z.string().trim().min(2, 'Area/neighborhood is required'),
  privateAddress: z.string().trim().min(5, 'Full private address is required for verification'),
  pickupPreference: z.string().trim().min(2, 'Pickup preference is required (e.g., Self Pickup, Delivery)')
});

export const updateListingSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(150, 'Title must not exceed 150 characters').optional(),
  description: z.string().trim().min(10, 'Description must be at least 10 characters').optional(),
  categoryId: z.string().trim().min(1, 'Category is required').optional(),
  pricePerDay: z.coerce.number().positive('Daily rental price must be greater than 0').optional(),
  depositAmount: z.coerce.number().nonnegative('Security deposit cannot be negative').optional(),
  area: z.string().trim().min(2, 'Area/neighborhood is required').optional(),
  privateAddress: z.string().trim().min(5, 'Full private address is required').optional(),
  pickupPreference: z.string().trim().min(2, 'Pickup preference is required').optional(),
  isActive: z.preprocess((val) => {
    if (typeof val === 'string') return val === 'true';
    return val;
  }, z.boolean().optional())
});

export const listQuerySchema = z.object({
  category: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  area: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
  sort: z.enum(['newest', 'price_asc', 'price_desc']).default('newest')
});
