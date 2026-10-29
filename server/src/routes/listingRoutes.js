import { Router } from 'express';
import * as listingController from '../controllers/listingController.js';
import { authenticate, optionalAuthenticate, authorizeRoles } from '../middleware/authMiddleware.js';
import { uploadListingImages } from '../middleware/upload.js';
import { validateBody, validateQuery } from '../middleware/validate.js';
import {
  createListingSchema,
  updateListingSchema,
  listQuerySchema
} from '../validators/listingValidator.js';

const router = Router();

// Public listing browsing with filters and pagination
router.get('/', validateQuery(listQuerySchema), listingController.getListings);

// Owner's listings (Must come before /:id)
router.get(
  '/mine',
  authenticate,
  authorizeRoles('OWNER', 'ADMIN'),
  listingController.getMyListings
);

// Public single listing details (Optional auth to display owner's private info only to owner)
router.get('/:id', optionalAuthenticate, listingController.getListingById);

// Owner listing management
router.post(
  '/',
  authenticate,
  authorizeRoles('OWNER', 'ADMIN'),
  uploadListingImages,
  validateBody(createListingSchema),
  listingController.createListing
);

router.put(
  '/:id',
  authenticate,
  authorizeRoles('OWNER', 'ADMIN'),
  uploadListingImages,
  validateBody(updateListingSchema),
  listingController.updateListing
);

router.delete(
  '/:id',
  authenticate,
  authorizeRoles('OWNER', 'ADMIN'),
  listingController.deleteListing
);

export default router;
