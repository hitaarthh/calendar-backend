import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpStatus, HttpException } from '@nestjs/common';
import { EventsService } from '../services/event.services';
import { NotificationService } from '../services/notification.service';
import { CreateEventDto } from '../dto/create-event.dto';
import { Event } from '../models/event.model';
import { EventsGateway } from '../gateways/events.gateway';

@Controller('events')
export class EventsController {
    constructor(
        private readonly eventsService: EventsService,
        private readonly notificationService: NotificationService,
        private readonly eventsGateway: EventsGateway
    ) { }

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

    @Get('hello')
    hello() {
        return { message: 'Hello World' };
    }

    @Get('test-notification')
    testNotification() {
        // Get any event from the database
        const events = this.eventsService.findAll();

        if (events.length === 0) {
            throw new HttpException('No events found in database', HttpStatus.NOT_FOUND);
        }

        // Use the first available event
        const event = events[0];

        console.log('Sending test notification for event:', event.title, 'with ID:', event.id);

        // Force-send a notification for this event
        this.notificationService.sendNotification(event);

        return {
            success: true,
            message: `Test notification sent for event: ${event.title}`
        };
    }

    @Get('manual-notification')
    manualNotification() {
        try {
            if (!this.eventsGateway.server) {
                return { success: false, error: 'WebSocket server not initialized' };
            }

            this.eventsGateway.server.emit('notification', {
                id: 'test-123',
                title: 'Manual Test Notification',
                description: 'This is a test notification',
                time: new Date()
            });

            console.log('Manual notification sent via WebSocket');
            return { success: true };
        } catch (error) {
            console.error('Error sending notification:', error);
            return { success: false, error: error.message };
        }
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

    @Post(':id/snooze')
    snoozeNotification(@Param('id') id: string): { success: boolean } {
        this.notificationService.snoozeNotification(id);
        return { success: true };
    }

    @Post(':id/dismiss')
    dismissNotification(@Param('id') id: string): { success: boolean } {
        this.notificationService.dismissNotification(id);
        return { success: true };
    }
}