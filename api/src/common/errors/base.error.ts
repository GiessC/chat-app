import { type HttpStatus } from '@nestjs/common';
import type { ErrorCode } from './error-code';

export default class BaseError extends Error {
  constructor(
    public readonly name: string,
    readonly message: string,
    public readonly errorCode: ErrorCode,
    public readonly cause?: Error,
    public readonly httpStatus?: HttpStatus,
  ) {
    super(message);
    if (cause instanceof BaseError && !this.httpStatus) {
      this.httpStatus = cause.httpStatus;
    }
  }

  public toString(): string {
    return `${this.name} (${this.errorCode}): ${this.message} ${this.httpStatus ? `HTTP Status: ${this.httpStatus}.` : ''} ${this.cause ? `Inner Error: ${this.cause.toString()}` : ''}`;
  }
}
