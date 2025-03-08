import { Inject, Injectable } from '@nestjs/common';
import CognitoService, { SignUpResponse } from './cognito.service';

@Injectable()
export default class AuthService {
  constructor(@Inject() private readonly cognitoService: CognitoService) {}

  signUp(
    username: string,
    password: string,
    email?: string,
    phoneNumber?: string,
  ): Promise<SignUpResponse | undefined> {
    return this.cognitoService.signUp(username, password, email, phoneNumber);
  }

  confirmSignUp(emailOrPhone: string, code: string): Promise<void> {
    return this.cognitoService.confirmSignUp(emailOrPhone, code);
  }
}
