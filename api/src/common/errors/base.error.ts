import { type HttpStatus } from '@nestjs/common';
import type { ErrorCode } from './error-code';

export default class BaseError extends Error {
  constructor(
    public readonly name: string,
    readonly message: string,
    public readonly errorCode: ErrorCode,
    public readonly innerError?: Error,
    public readonly httpStatus?: HttpStatus,
  ) {
    super(message);
    if (innerError instanceof BaseError && !this.httpStatus) {
      this.httpStatus = innerError.httpStatus;
    }
  }

  public toString(): string {
    return `${this.name} (${this.errorCode}): ${this.message} ${this.httpStatus ? `HTTP Status: ${this.httpStatus}.` : ''} ${this.innerError ? `Inner Error: ${this.innerError.toString()}` : ''}`;
  }
}
