// Wraps an async route handler so a rejected promise (e.g. a DB error) is
// forwarded to Express's error middleware instead of crashing the process.
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
