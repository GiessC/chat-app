import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  SignUpCommand,
  SignUpCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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
