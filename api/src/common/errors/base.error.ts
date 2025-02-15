import { type HttpStatus } from '@nestjs/common';

export default class BaseError extends Error {
  constructor(
    public readonly name: string,
    readonly message: string,
    public readonly innerError?: Error,
    public readonly httpStatus?: HttpStatus,
  ) {
    super(message);
    if (innerError instanceof BaseError && !this.httpStatus) {
      this.httpStatus = innerError.httpStatus;
    }
  }
}
