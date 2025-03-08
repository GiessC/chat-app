import { PublicRoute } from '@nestjs-cognito/auth';
import { Controller, Inject, Post } from '@nestjs/common';
import AuthService from './providers/auth.service';

@Controller('auth')
export default class AuthenticationController {
  constructor(@Inject() private readonly authService: AuthService) {}

  @Post('sign-up')
  @PublicRoute()
  signUp() {}
}
