/**
 * Higher-order function to handle asynchronous route handlers.
 * Automatically catches errors and passes them to the Next() middleware.
 *
 * @param {Function} requestHandler - Async route handler function
 * @returns {Function} Express middleware function
 */
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };
