export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ApiResponse {
  static success(res, { statusCode = 200, message = 'Success', data = null, meta = null } = {}) {
    const responseBody = {
      success: true,
      message,
      ...(data !== null && { data }),
      ...(meta !== null && { meta })
    };
    return res.status(statusCode).json(responseBody);
  }

  static error(res, { statusCode = 500, message = 'Internal Server Error', code = 'INTERNAL_ERROR', details = null } = {}) {
    const responseBody = {
      success: false,
      error: {
        message,
        code,
        ...(details && { details })
      }
    };
    return res.status(statusCode).json(responseBody);
  }
}
