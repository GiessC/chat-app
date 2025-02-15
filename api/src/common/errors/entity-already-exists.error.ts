import BaseError from './base.error';
import { HttpStatus } from '@nestjs/common';

export default class EntityAlreadyExistsError extends BaseError {
  constructor(message: string) {
    super('EntityAlreadyExistsError', message, undefined, HttpStatus.CONFLICT);
  }
}
