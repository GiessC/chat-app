import type { ErrorCode } from './error-code';

export default class BaseError extends Error {
  constructor(
    public readonly name: string,
    readonly message: string,
    public readonly errorCode: ErrorCode,
    public readonly errorCause?: Error,
  ) {
    super(message);
  }

  public toString(): string {
    return `${this.name} (${this.errorCode}): ${this.message} ${this.errorCause ? `Inner Error: ${this.errorCause.toString()}` : ''}`;
  }
}
