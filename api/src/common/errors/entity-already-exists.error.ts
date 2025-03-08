import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from './error-code';
import HttpError from './http.error';

export default class EntityAlreadyExistsError extends HttpError {
  constructor(message: string, cause?: Error) {
    super(
      'EntityAlreadyExistsError',
      message,
      ErrorCode.ENTITY_ALREADY_EXISTS,
      cause,
      HttpStatus.CONFLICT,
    );
  }
}
