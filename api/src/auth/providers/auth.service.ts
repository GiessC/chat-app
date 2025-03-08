import { Inject, Injectable } from '@nestjs/common';
import CognitoService from './cognito.service';

@Injectable()
export default class AuthService {
  constructor(@Inject() private readonly cognitoService: CognitoService) {}

  signUp(
    username: string,
    password: string,
    email?: string,
    phoneNumber?: string,
  ) {
    return this.cognitoService.signUp(username, password, email, phoneNumber);
  }
}
