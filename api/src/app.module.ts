import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServerModule } from './features/server/server.module';
import { ServerInviteModule } from './features/server-invite/server-invite.module';
import { CognitoAuthModule } from '@nestjs-cognito/auth';

@Module({
  imports: [
    CognitoAuthModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        jwtVerifier: {
          userPoolId: configService.get('COGNITO_USER_POOL_ID') ?? '',
          clientId: configService.get('COGNITO_CLIENT_ID') ?? '',
          tokenUse: 'id',
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        '.env.local',
        '.env.development.local',
        '.env.development',
        '.env.production.local',
        '.env.production',
      ],
    }),
    ServerModule,
    ServerInviteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
