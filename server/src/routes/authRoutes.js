import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { validateBody } from '../middleware/validate.js';
import {
  registerSchema,
  verifyEmailSchema,
  resendOtpSchema,
  loginSchema
} from '../validators/authValidator.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authLimiter, otpResendLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authLimiter, validateBody(registerSchema), authController.register);
router.post('/verify-email', authLimiter, validateBody(verifyEmailSchema), authController.verifyEmail);
router.post('/resend-otp', otpResendLimiter, validateBody(resendOtpSchema), authController.resendOtp);
router.post('/login', authLimiter, validateBody(loginSchema), authController.login);
router.get('/me', authenticate, authController.getMe);

export default router;
