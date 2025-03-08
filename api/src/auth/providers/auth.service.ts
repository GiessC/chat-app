import { Inject, Injectable } from '@nestjs/common';
import CognitoService, { SignUpResponse } from './cognito.service';

@Injectable()
export default class AuthService {
  constructor(@Inject() private readonly cognitoService: CognitoService) {}

  signUp(
    username: string,
    password: string,
    email: string,
  ): Promise<SignUpResponse | undefined> {
    return this.cognitoService.signUp(username, password, email);
  }

  confirmSignUp(email: string, code: string): Promise<void> {
    return this.cognitoService.confirmSignUp(email, code);
  }
}
