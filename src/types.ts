import { Request, Response, NextFunction } from 'express';

export interface ImageRecognitionAPI {
  execute(): void;
}

export type ExpressRouteFunc =
  | ((req: Request, res: Response, next: NextFunction) => void | Promise<void>)
  | ((req: Request, res: Response) => void | Promise<void>);
