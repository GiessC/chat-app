import BaseError from '@/types/errors/base.error';

export class AuthError extends BaseError {
  constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
