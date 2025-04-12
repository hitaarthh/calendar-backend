// src/events/events.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpStatus, HttpException } from '@nestjs/common';
import { EventsService } from '../services/event.services';
import { CreateEventDto } from '../dto/create-event.dto';
import { Event } from '../models/event.model';

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @Get()
    findAll(): Event[] {
        return this.eventsService.findAll();
    }

    @Get('search')
    search(@Query('q') query: string): Event[] {
        return this.eventsService.search(query);
    }

    @Get('range')
    findByDateRange(
        @Query('start') start: string,
        @Query('end') end: string,
    ): Event[] {
        return this.eventsService.findByDateRange(new Date(start), new Date(end));
    }

    @Get(':id')
    findOne(@Param('id') id: string): Event {
        const event = this.eventsService.findById(id);
        if (!event) {
            throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
        }
        return event;
    }

    @Post()
    create(@Body() createEventDto: CreateEventDto): Event {
        return this.eventsService.create(createEventDto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateEventDto: Partial<CreateEventDto>): Event {
        const updatedEvent = this.eventsService.update(id, updateEventDto);
        if (!updatedEvent) {
            throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
        }
        return updatedEvent;
    }

    @Delete(':id')
    remove(@Param('id') id: string): { success: boolean } {
        const result = this.eventsService.delete(id);
        if (!result) {
            throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
        }
        return { success: true };
    }
}