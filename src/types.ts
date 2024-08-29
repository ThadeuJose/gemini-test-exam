import { Request, Response, NextFunction } from 'express';

export interface ImageRecognitionAPI {
  execute(): void;
}

export type ErrorReturn = {
  error_code: 'INTERNAL_SERVER_ERROR' | 'INVALID_DATA';
  error_description: string;
};

export type ExpressRouteFunc =
  | ((req: Request, res: Response, next: NextFunction) => void | Promise<void>)
  | ((req: Request, res: Response) => void | Promise<void>);
