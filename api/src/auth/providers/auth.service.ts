import { Inject, Injectable } from '@nestjs/common';
import CognitoService from './cognito.service';

@Injectable()
export default class AuthService {
  constructor(@Inject() private readonly cognitoService: CognitoService) {}
}
