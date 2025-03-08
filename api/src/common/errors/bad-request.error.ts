import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from './error-code';
import HttpError from './http.error';

export default class BadRequestError extends HttpError {
  constructor(message: string, errorCode: ErrorCode, cause?: Error) {
    super('BadRequest', message, errorCode, cause, HttpStatus.BAD_REQUEST);
  }
}
