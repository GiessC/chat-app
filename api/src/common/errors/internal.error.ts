import BaseError from './base.error';
import { ErrorCode } from './error-code';
import { HttpStatus } from '@nestjs/common';

export default class InternalError extends BaseError {
  constructor(message: string, cause?: Error) {
    super(
      'InternalError',
      message,
      ErrorCode.INTERNAL,
      cause,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
