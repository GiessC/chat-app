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
    );
  }

  @Post('sign-up/confirm')
  @HttpCode(HttpStatus.OK)
  @PublicRoute()
  confirmSignUp(@Body() request: ConfirmSignUpRequest) {
    return this.authService.confirmSignUp(request.email, request.code);
  }
}

interface SignUpRequest {
  username: string;
  password: string;
  email: string;
}

interface ConfirmSignUpRequest {
  email: string;
  code: string;
}
