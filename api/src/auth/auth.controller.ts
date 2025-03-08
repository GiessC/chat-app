import { PublicRoute } from '@nestjs-cognito/auth';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import AuthService from './providers/auth.service';

@Controller('auth')
export default class AuthenticationController {
  constructor(@Inject() private readonly authService: AuthService) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.OK)
  @PublicRoute()
  signUp(@Body() request: SignUpRequest) {
    return this.authService.signUp(
      request.username,
      request.password,
      request.email,
      request.phoneNumber,
    );
  }

  @Post('sign-up/confirm')
  @HttpCode(HttpStatus.OK)
  @PublicRoute()
  confirmSignUp(@Body() request: ConfirmSignUpRequest) {
    return this.authService.confirmSignUp(
      request.emailOrPhoneNumber,
      request.code,
    );
  }
}

interface SignUpRequest {
  username: string;
  password: string;
  email?: string;
  phoneNumber?: string;
}

interface ConfirmSignUpRequest {
  emailOrPhoneNumber: string;
  code: string;
}
