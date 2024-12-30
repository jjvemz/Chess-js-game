import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';

import { VideoPlayerModule } from './video-player/video-player.module';

@Module({
  imports: [ GameModule, VideoPlayerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
