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
    email?: string,
    phoneNumber?: string,
  ): Promise<SignUpResponse | undefined> {
    const cognitoUsername: string = email ?? phoneNumber!;
    const commandInput: SignUpCommandInput = {
      ClientId: this.configService.get('COGNITO_CLIENT_ID'),
      Username: cognitoUsername,
      Password: password,
      UserAttributes: [
        {
          Name: 'preferred_username',
          Value: username,
        },
      ],
    };
    this.addOptionalAttributesIfSpecified(commandInput, { email, phoneNumber });
    const response = await this.cognitoClient.send(
      new SignUpCommand(commandInput),
    );
    return response.UserSub
      ? {
          emailOrPhoneNumber: cognitoUsername,
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

  addOptionalAttributesIfSpecified(
    commandInput: SignUpCommandInput,
    request: { email?: string; phoneNumber?: string },
  ) {
    if (request.email) {
      commandInput.UserAttributes!.push({
        Name: 'email',
        Value: request.email,
      });
    }
    if (request.phoneNumber) {
      commandInput.UserAttributes!.push({
        Name: 'phone_number',
        Value: request.phoneNumber,
      });
    }
  }
}

export interface SignUpResponse {
  emailOrPhoneNumber: string;
  userId: string;
  isConfirmed: boolean;
}
