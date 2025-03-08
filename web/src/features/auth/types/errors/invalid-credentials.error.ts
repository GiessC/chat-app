import BaseError from '@/types/errors/base.error';

export class InvalidCredentialsError extends BaseError {
  constructor(message: string) {
    super(message);
  }
}
