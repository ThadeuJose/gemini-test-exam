import { NextFunction, Request, Response } from 'express';
import {
  getIdGenerator,
  getImageRecognitionAPI,
  getImageUploaderAPI,
} from '../service-injection';
import {
  ExpressRouteFunc,
  IdGenerator,
  ImageRecognitionAPI,
  ImageUploaderAPI,
  UploadResponse,
} from '../types';

export function createUploadHandler(
  api: ImageRecognitionAPI = getImageRecognitionAPI(),
  idGenerator: IdGenerator = getIdGenerator(),
  uploader: ImageUploaderAPI = getImageUploaderAPI(),
): ExpressRouteFunc {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const image = req.body.image;
      const filename = `${req.body.customer_code}_${req.body.measure_type}`;
      const response: UploadResponse = {
        image_url: await uploader.uploadImage(image, filename),
        measure_value: await api.execute(image),
        measure_uuid: idGenerator.createId(),
      };

      res.json(response);
    } catch (err) {
      next(err);
    }
  };
}
