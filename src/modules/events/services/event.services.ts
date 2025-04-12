import { ConflictException, Injectable } from '@nestjs/common';
import { Event } from '../models/event.model';
import { v4 as uuidv4 } from 'uuid';

type CreateEventParams = Omit<Event, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateEventParams = Partial<Omit<Event, 'id' | 'createdAt'>>;

@Injectable()
export class EventsService {
    private events: Map<string, Event> = new Map<string, Event>();

    findAll(): Event[] {
        return Array.from(this.events.values());
    }

    findById(id: string): Event | undefined {
        return this.events.get(id);
    }

    findByDateRange(startDate: Date, endDate: Date): Event[] {
        return this.findAll().filter(
            (event) =>
                new Date(event.startDate) >= new Date(startDate) &&
                new Date(event.startDate) <= new Date(endDate)
        );
    }

    create(eventData: CreateEventParams): Event {
        const now: Date = new Date();

        const isDuplicate = Array.from(this.events.values()).some((event) =>
            (event.title ?? '').trim().toLowerCase() === (eventData.title ?? '').trim().toLowerCase() &&
            new Date(event.startDate ?? 0).getTime() === new Date(eventData.startDate ?? 0).getTime() &&
            new Date(event.endDate ?? 0).getTime() === new Date(eventData.endDate ?? 0).getTime() &&
            (event.location ?? '').trim().toLowerCase() === (eventData.location ?? '').trim().toLowerCase()
        );

        if (isDuplicate) {
            throw new ConflictException('Duplicate event detected with same title, date, and location.');
        }

        const newId: string = uuidv4();

        const newEvent: Event = {
            ...eventData,
            id: newId,
            createdAt: now,
            updatedAt: now,
        };

        this.events.set(newId, newEvent);
        return newEvent;
    }

    update(id: string, eventData: UpdateEventParams): Event | undefined {
        const existingEvent = this.events.get(id);

        if (!existingEvent) {
            return undefined;
        }

        const updatedEvent: Event = {
            ...existingEvent,
            ...eventData,
            updatedAt: new Date(),
        };

        this.events.set(id, updatedEvent);
        return updatedEvent;
    }

    delete(id: string): boolean {
        return this.events.delete(id);
    }

    search(query: string): Event[] {
        const lowercaseQuery = query.toLowerCase();
        return this.findAll().filter(
            (event) =>
                event.title.toLowerCase().includes(lowercaseQuery) ||
                event.description.toLowerCase().includes(lowercaseQuery) ||
                (event.location && event.location.toLowerCase().includes(lowercaseQuery))
        );
    }
}