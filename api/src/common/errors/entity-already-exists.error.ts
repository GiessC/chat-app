import BaseError from './base.error';
import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from './error-code';

export default class EntityAlreadyExistsError extends BaseError {
  constructor(message: string) {
    super(
      'EntityAlreadyExistsError',
      message,
      ErrorCode.ENTITY_ALREADY_EXISTS,
      undefined,
      HttpStatus.CONFLICT,
    );
  }
}
