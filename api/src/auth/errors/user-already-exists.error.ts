import EntityAlreadyExistsError from 'src/common/errors/entity-already-exists.error';

export default class UserAlreadyExistsError extends EntityAlreadyExistsError {
  constructor(cause?: Error) {
    super('A user with the specified username already exists', cause);
  }
}
