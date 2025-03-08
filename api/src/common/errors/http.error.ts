import { HttpException, type HttpStatus } from '@nestjs/common';
import type { ErrorCode } from './error-code';

export default class HttpError extends HttpException {
  constructor(
    public readonly name: string,
    readonly message: string,
    public readonly errorCode: ErrorCode,
    public readonly errorCause?: Error,
    public readonly httpStatus?: HttpStatus,
  ) {
    super(message, httpStatus as number, {
      cause: errorCause,
    });
    if (errorCause instanceof HttpError && !this.httpStatus) {
      this.httpStatus = errorCause.httpStatus;
    }
  }

  public toString(): string {
    return `${this.name} (${this.errorCode}): ${this.message} ${this.httpStatus ? `HTTP Status: ${this.httpStatus}.` : ''} ${this.errorCause ? `Inner Error: ${this.errorCause.toString()}` : ''}`;
  }
}
