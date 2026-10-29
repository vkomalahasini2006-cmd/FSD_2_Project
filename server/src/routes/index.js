import { Router } from 'express';
import authRoutes from './authRoutes.js';
import listingRoutes from './listingRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import productRoutes from './productRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import { ApiResponse } from '../utils/apiResponse.js';

const router = Router();

router.get('/health', (req, res) => {
  return ApiResponse.success(res, {
    message: 'RentKart API is healthy and operational',
    data: { timestamp: new Date().toISOString() }
  });
});

router.use('/auth', authRoutes);
router.use('/listings', listingRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/bookings', bookingRoutes);

export default router;

