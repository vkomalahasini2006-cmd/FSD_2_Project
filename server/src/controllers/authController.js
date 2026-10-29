import * as authService from '../services/authService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    return ApiResponse.success(res, {
      statusCode: 201,
      message: result.message,
      data: { user: result.user }
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const result = await authService.verifyEmail(req.body);
    return ApiResponse.success(res, {
      statusCode: 200,
      message: result.message,
      data: {
        user: result.user,
        token: result.token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const resendOtp = async (req, res, next) => {
  try {
    const result = await authService.resendOtp(req.body);
    return ApiResponse.success(res, {
      statusCode: 200,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    return ApiResponse.success(res, {
      statusCode: 200,
      message: result.message,
      data: {
        user: result.user,
        token: result.token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    return ApiResponse.success(res, {
      statusCode: 200,
      message: 'Profile retrieved successfully',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};
