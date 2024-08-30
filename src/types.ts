import { Request, Response, NextFunction } from 'express';

export interface ImageRecognitionAPI {
  execute(image: string): Promise<number>;
}

export interface ImageUploaderAPI {
  uploadImage(image: string, filename: string): Promise<string>;
}

export interface IdGenerator {
  createId(): string;
}

export type ErrorReturn = {
  error_code: 'INTERNAL_SERVER_ERROR' | 'INVALID_DATA';
  error_description: string;
};

export type UploadResponse = {
  image_url: string;
  measure_value: number;
  measure_uuid: string;
};

export type ExpressRouteFunc =
  | ((req: Request, res: Response, next: NextFunction) => void | Promise<void>)
  | ((req: Request, res: Response) => void | Promise<void>);
