import { Request, Response } from 'express';
import { getImageRecognitionAPI } from '../service-injection';
import { ExpressRouteFunc, ImageRecognitionAPI } from '../types';

export function createUploadHandler(
  api: ImageRecognitionAPI = getImageRecognitionAPI(),
): ExpressRouteFunc {
  return async function (req: Request, res: Response) {
    api.execute();
    res.send('Hello, TypeScript and Express!');
  };
}
