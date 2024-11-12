import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { EventsService } from './events.service';
import { Event } from './events.service'; // Import it properly from the service or a shared file

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  findAll(): Event[] {
    return this.eventsService.findAll();
  }

  @Post()
  create(@Body() event: Omit<Event, 'id'>): Event {
    return this.eventsService.create(event);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() event: Partial<Event>): Event {
    return this.eventsService.update(+id, event);
  }

  @Delete(':id')
  remove(@Param('id') id: number): void {
    this.eventsService.remove(+id);
  }
}
