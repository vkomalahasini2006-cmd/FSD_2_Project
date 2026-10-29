import { ApiResponse, AppError } from '../utils/apiResponse.js';

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let code = err.code || 'INTERNAL_ERROR';
  let details = err.details || null;

  // Handle Prisma unique constraint violations (P2002)
  if (err.code === 'P2002') {
    statusCode = 409;
    code = 'DUPLICATE_ENTRY';
    const target = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : 'field';
    message = `A record with this ${target} already exists.`;
  }

  // Handle Prisma not found errors (P2025)
  if (err.code === 'P2025') {
    statusCode = 404;
    code = 'NOT_FOUND';
    message = 'Requested record was not found.';
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    code = 'INVALID_TOKEN';
    message = 'Invalid authentication token. Please log in again.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    code = 'TOKEN_EXPIRED';
    message = 'Authentication token has expired. Please log in again.';
  }

  // Handle Multer upload errors
  if (err.name === 'MulterError') {
    statusCode = 400;
    code = 'UPLOAD_ERROR';
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File size too large. Maximum size allowed is 5MB per image.';
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      message = 'Too many files. You can upload a maximum of 4 images per listing.';
    } else {
      message = err.message;
    }
  }

  // Only log unexpected server errors (500)
  if (statusCode >= 500) {
    console.error('💥 Unhandled Exception:', err);
  }

  return ApiResponse.error(res, {
    statusCode,
    message,
    code,
    details
  });
};
