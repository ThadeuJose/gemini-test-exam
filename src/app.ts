import express, { Request, Response, NextFunction } from 'express';
import { createUploadHandler } from './upload/upload-handler';
import { customerQuerySchema, uploadBodySchema, validate } from './validate';
import { HttpStatus } from './http-status';
import { AppError } from './app-error';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import { createCustomerHandler } from './customer/customer-handler';

export const app = express();

if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Serve static files
app.use('/images', express.static(join(__dirname, 'images')));

app.get(
  '/:customer_code/list',
  validate(customerQuerySchema),
  createCustomerHandler(),
);
app.post('/upload', validate(uploadBodySchema), createUploadHandler());

// Catch-all for 404 errors
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(HttpStatus.NOT_FOUND, 'Not found'));
});

// Error-handling middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(err.stack);
  }
  const status = err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

  res.status(status).json(err.message);
});
