import {
  CodeMismatchException,
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  ExpiredCodeException,
  InvalidPasswordException,
  SignUpCommand,
  SignUpCommandInput,
  UsernameExistsException,
  UserNotFoundException,
} from '@aws-sdk/client-cognito-identity-provider';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import UserAlreadyExistsError from '../errors/user-already-exists.error';
import InvalidPasswordError from '../errors/invalid-password.error';
import BadRequestError from 'src/common/errors/bad-request.error';
import { ErrorCode } from 'src/common/errors/error-code';

export default class CognitoService {
  private readonly cognitoClient: CognitoIdentityProviderClient;

  constructor(@Inject() private readonly configService: ConfigService) {
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: this.configService.get('COGNITO_REGION') ?? '',
    });
  }

  async signUp(
    username: string,
    password: string,
    email: string,
  ): Promise<SignUpResponse | undefined> {
    try {
      return await this.trySignUp(username, password, email);
    } catch (error: unknown) {
      if (error instanceof UsernameExistsException) {
        throw new UserAlreadyExistsError(error);
      }
      if (error instanceof InvalidPasswordException) {
        throw new InvalidPasswordError(error);
      }
      throw error;
    }
  }

  private async trySignUp(
    username: string,
    password: string,
    email: string,
  ): Promise<SignUpResponse | undefined> {
    const commandInput: SignUpCommandInput = {
      ClientId: this.configService.get('COGNITO_CLIENT_ID'),
      Username: email,
      Password: password,
      UserAttributes: [
        {
          Name: 'preferred_username',
          Value: username,
        },
        {
          Name: 'email',
          Value: email,
        },
      ],
    };
    const response = await this.cognitoClient.send(
      new SignUpCommand(commandInput),
    );
    return response.UserSub
      ? {
          email,
          userId: response.UserSub,
          isConfirmed: response.UserConfirmed ?? false,
        }
      : undefined;
  }

  async confirmSignUp(email: string, code: string): Promise<void> {
    try {
      await this.tryConfirmSignUp(email, code);
    } catch (error: unknown) {
      if (error instanceof CodeMismatchException) {
        throw new BadRequestError(
          'The confirmation code specified is invalid.',
          ErrorCode.INVALID_AUTH_CODE,
          error,
        );
      }
      if (error instanceof ExpiredCodeException) {
        throw new BadRequestError(
          'Specified user does not exist or the code has expired.',
          ErrorCode.EXPIRED_AUTH_CODE,
          error,
        );
      }
      if (error instanceof UserNotFoundException) {
        throw new BadRequestError(
          'The user does not exist.',
          ErrorCode.ENTITY_NOT_FOUND,
          error,
        );
      }
      throw error;
    }
  }

  private async tryConfirmSignUp(email: string, code: string): Promise<void> {
    await this.cognitoClient.send(
      new ConfirmSignUpCommand({
        ClientId: this.configService.get('COGNITO_CLIENT_ID'),
        Username: email,
        ConfirmationCode: code,
      }),
    );
  }
}

export interface SignUpResponse {
  email: string;
  userId: string;
  isConfirmed: boolean;
}
