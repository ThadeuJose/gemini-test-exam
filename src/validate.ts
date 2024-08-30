import { AnyZodObject, z, ZodError } from 'zod';
import { AppError } from './app-error';
import { HttpStatus } from './http-status';
import { ErrorResponse, ExpressRouteFunc } from './types';

export const uploadBodySchema = z
  .object({
    body: z.object({
      image: z.string().refine(validateImage, {
        message: 'Invalid Base64 image format',
      }),
      customer_code: z.string(),
      measure_datetime: z.string().datetime(),
      measure_type: z.enum(['WATER', 'GAS']),
    }),
  })
  .describe('Upload Body Schema');

// TODO: Improve
function validateImage(imageValue: string) {
  const base64ImageRegex = /^data:image\/(?:jpeg|jpg|png);base64,/;
  return (
    base64ImageRegex.test(imageValue) &&
    imageValue.split(',')[1].length % 4 === 0
  );
}

export function validate(schema: AnyZodObject): ExpressRouteFunc {
  return async (req, res, next) => {
    try {
      const result = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      Object.assign(req, result);
      return next();
    } catch (error) {
      let message: ErrorResponse = {
        error_code: 'INTERNAL_SERVER_ERROR',
        error_description: `Something wrong with ${schema.description} validation`,
      };
      if (error instanceof ZodError) {
        message = {
          error_code: 'INVALID_DATA',
          error_description: error.issues
            .map((issue) => issue.message)
            .join(', '),
        };
      }
      return next(
        new AppError(HttpStatus.BAD_REQUEST, JSON.stringify(message)),
      );
    }
  };
}
