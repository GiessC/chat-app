import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  InvalidPasswordException,
  SignUpCommand,
  SignUpCommandInput,
  UsernameExistsException,
} from '@aws-sdk/client-cognito-identity-provider';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import UserAlreadyExistsError from '../errors/user-already-exists.error';
import InvalidPasswordError from '../errors/invalid-password.error';

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

  async trySignUp(
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

  async confirmSignUp(emailOrPhone: string, code: string): Promise<void> {
    await this.cognitoClient.send(
      new ConfirmSignUpCommand({
        ClientId: this.configService.get('COGNITO_CLIENT_ID'),
        Username: emailOrPhone,
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
