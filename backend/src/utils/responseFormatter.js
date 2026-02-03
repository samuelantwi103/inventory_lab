/**
 * API Response Formatter
 * Standardizes API responses across the application
 */
export const successResponse = (res, statusCode, data, message = 'Success') => {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};

export const errorResponse = (res, statusCode, error) => {
  return res.status(statusCode).json({
    success: false,
    error,
  });
};
