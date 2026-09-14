export const errorHandler = (err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    err.statusCode = 400;
    err.message = 'Invalid JSON body';
  }

  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Something went wrong',
    status
  });
};
