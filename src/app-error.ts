import { HttpStatus } from './http-status';

export class AppError extends Error {
  private _statusCode: HttpStatus;
  constructor(statusCode: HttpStatus, message: string) {
    super(message);
    this._statusCode = statusCode;
  }

  public get statusCode(): HttpStatus {
    return this._statusCode;
  }
}
