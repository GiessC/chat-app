import { ErrorCode } from './error-code';
import { HttpStatus } from '@nestjs/common';
import HttpError from './http.error';

export default class InternalError extends HttpError {
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
