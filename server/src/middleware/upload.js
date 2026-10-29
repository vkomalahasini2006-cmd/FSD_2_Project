import multer from 'multer';
import { AppError } from '../utils/apiResponse.js';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'Invalid file type. Only JPEG, PNG, and WebP image formats are supported.',
        400,
        'INVALID_FILE_TYPE'
      ),
      false
    );
  }
};

export const uploadListingImages = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 4 // Up to 4 images
  },
  fileFilter
}).array('images', 4);
