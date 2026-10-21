/**
 * Centralized error handling middleware.
 * Formats all errors consistently and returns appropriate HTTP status codes.
 */
const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  let statusCode = err.statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);
  let message = err.message || 'Internal Server Error';
  let errors = undefined;

  // 1. Handle SyntaxError (e.g. malformed JSON in request payload)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Malformed JSON in request body';
  }

  // 2. Handle Mongoose CastError (invalid ObjectId or type casting failure)
  else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ID format for parameter '${err.path || 'id'}'. Expected a valid 24-character hexadecimal ObjectId.`;
  }

  // 3. Handle MongoDB Duplicate Key Error (E11000)
  else if (err.code === 11000) {
    statusCode = 409;
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : 'field';
    const value = err.keyValue ? err.keyValue[field] : '';
    message = `A user with the ${field} '${value}' already exists.`;
    errors = [
      {
        field,
        message: `${field} must be unique`
      }
    ];
  }

  // 4. Handle Mongoose Validation Error
  else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors || {}).map((item) => ({
      field: item.path,
      message: item.message
    }));
  }

  const response = {
    success: false,
    message
  };

  if (errors && errors.length > 0) {
    response.errors = errors;
  }

  // Include stack trace only in development environment
  if (process.env.NODE_ENV === 'development' && statusCode === 500) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
