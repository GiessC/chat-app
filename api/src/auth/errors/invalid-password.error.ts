import BadRequestError from 'src/common/errors/bad-request.error';
import { ErrorCode } from 'src/common/errors/error-code';

export default class InvalidPasswordError extends BadRequestError {
  constructor(cause?: Error) {
    super(
      'The password specified is invalid.',
      ErrorCode.INVALID_PASSWORD,
      cause,
    );
  }
}
