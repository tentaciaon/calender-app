import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface Event {
  id: number;
  title: string;
  date: string;
  description: string;
}

@Injectable()
export class EventsService {
  private events: Event[] = [];

  findAll(): Event[] {
    return this.events;
  }

  constructor(private configService: ConfigService) {
    const databaseUrl = this.configService.get<string>('DATABASE_URL');
    console.log(`Connecting to database at ${databaseUrl}`);
  }


  create(event: Omit<Event, 'id'>): Event {
    const newEvent = { id: this.events.length + 1, ...event };
    this.events.push(newEvent);
    return newEvent;
  }

  update(id: number, event: Partial<Event>): Event {
    const index = this.events.findIndex((e) => e.id === id);
    if (index !== -1) {
      this.events[index] = { ...this.events[index], ...event };
      return this.events[index];
    }
    return null;
  }

  remove(id: number): void {
    this.events = this.events.filter((event) => event.id !== id);
  }
}

export { Event };
