import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { GameModule } from './game/game.module';
import { VideoPlayerModule } from './video-player/video-player.module';

@Module({
  imports: [ChatModule, GameModule, VideoPlayerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
