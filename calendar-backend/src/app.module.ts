import { Module } from '@nestjs/common';
import { EventsController } from './events/events.controller';
import { EventsService } from './events/events.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [EventsController],
  providers: [EventsService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the ConfigModule available globally
    }),
    
  ],
})
export class AppModule {}
