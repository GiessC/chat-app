import BaseError from './base.error';
import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from './error-code';

export default class EntityAlreadyExistsError extends BaseError {
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
