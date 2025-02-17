import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ServerModule } from './features/server/server.module';
import { ServerInviteModule } from './features/server-invite/server-invite.module';

@Module({
  imports: [
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
