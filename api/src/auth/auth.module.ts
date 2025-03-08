import { Module } from '@nestjs/common';
import AuthenticationController from './auth.controller';
import AuthService from './providers/auth.service';
import CognitoService from './providers/cognito.service';

@Module({
  controllers: [AuthenticationController],
  providers: [AuthService, CognitoService],
})
export class AuthenticationModule {}
