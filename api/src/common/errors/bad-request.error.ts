import { HttpStatus } from '@nestjs/common';
import BaseError from './base.error';
import { ErrorCode } from './error-code';

export default class BadRequestError extends BaseError {
  constructor(message: string, errorCode: ErrorCode, cause?: Error) {
    super('BadRequest', message, errorCode, cause, HttpStatus.BAD_REQUEST);
  }
}
