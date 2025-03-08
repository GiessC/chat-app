import BaseError from '@/types/errors/base.error';

export default class MustConfirmEmailError extends BaseError {
  constructor(cause?: Error) {
    super(
      'You must confirm your account using the code sent via email.',
      cause,
    );
  }
}
