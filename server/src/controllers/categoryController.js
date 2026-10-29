import * as categoryService from '../services/categoryService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories();
    return ApiResponse.success(res, {
      statusCode: 200,
      message: 'Categories fetched successfully',
      data: categories
    });
  } catch (error) {
    next(error);
  }
};
