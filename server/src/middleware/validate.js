import { AppError } from '../utils/apiResponse.js';

export const validateBody = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error.errors) {
      const fieldErrors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return next(new AppError('Validation failed', 400, 'VALIDATION_ERROR', fieldErrors));
    }
    next(error);
  }
};

export const validateQuery = (schema) => (req, res, next) => {
  try {
    req.query = schema.parse(req.query);
    next();
  } catch (error) {
    if (error.errors) {
      const fieldErrors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return next(new AppError('Invalid query parameters', 400, 'VALIDATION_ERROR', fieldErrors));
    }
    next(error);
  }
};
