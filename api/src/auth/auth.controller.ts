import { PublicRoute } from '@nestjs-cognito/auth';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import AuthService from './providers/auth.service';

@Controller('auth')
export default class AuthenticationController {
  constructor(@Inject() private readonly authService: AuthService) {}

  @Post('sign-up')
  @PublicRoute()
  signUp(@Body() request: SignUpRequest) {
    return this.authService.signUp(
      request.username,
      request.password,
      request.email,
      request.phoneNumber,
    );
  }
}

interface SignUpRequest {
  username: string;
  password: string;
  email?: string;
  phoneNumber?: string;
}
