export default class BaseError extends Error {
  constructor(
    message: string,
    readonly cause?: Error,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}
