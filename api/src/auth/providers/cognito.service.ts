import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export default class CognitoService {
  private readonly cognitoClient: CognitoIdentityProviderClient;

  constructor(@Inject() private readonly configService: ConfigService) {
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: this.configService.get('COGNITO_REGION') ?? '',
    });
  }
}
