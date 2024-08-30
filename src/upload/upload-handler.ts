import { NextFunction, Request, Response } from 'express';
import {
  getDatabase,
  getIdGenerator,
  getImageRecognitionAPI,
  getImageUploaderAPI,
} from '../service-injection';
import {
  Database,
  ExpressRouteFunc,
  IdGenerator,
  ImageRecognitionAPI,
  ImageUploaderAPI,
  UploadResponse,
} from '../types';
import { createUploadService } from './upload-service';

export function createUploadHandler(
  api: ImageRecognitionAPI = getImageRecognitionAPI(),
  idGenerator: IdGenerator = getIdGenerator(),
  uploader: ImageUploaderAPI = getImageUploaderAPI(),
  database: Database = getDatabase(),
): ExpressRouteFunc {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const customer_code = req.body.customer_code;
      const measure_datetime = req.body.measure_datetime;
      const measure_type = req.body.measure_type;
      const image = req.body.image;
      const response: UploadResponse = await createUploadService(
        database,
        customer_code,
        measure_datetime,
        measure_type,
        image,
        uploader,
        api,
        idGenerator,
      );

      res.json(response);
    } catch (err) {
      next(err);
    }
  };
}
