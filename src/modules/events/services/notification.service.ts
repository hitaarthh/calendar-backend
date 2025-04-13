import { Injectable, OnModuleInit, Inject, forwardRef } from '@nestjs/common';
import { EventsService } from './event.services';
import { EventsGateway } from '../gateways/events.gateway';
import { Event } from '../models/event.model';

@Injectable()
export class NotificationService implements OnModuleInit {
    private notificationTimers: Map<string, NodeJS.Timeout> = new Map();

    constructor(
        @Inject(forwardRef(() => EventsService))
        private readonly eventsService: EventsService,
        @Inject(forwardRef(() => EventsGateway))
        private readonly eventsGateway: EventsGateway,
    ) { }

    onModuleInit() {
        // Schedule all existing events on startup
        setTimeout(() => {
            this.eventsService.findAll().forEach(event => {
                this.scheduleNotification(event);
            });
        }, 1000); // Small delay to ensure services are initialized
    }

    scheduleNotification(event: Event) {
        // Clear existing timer if there is one
        if (this.notificationTimers.has(event.id)) {
            clearTimeout(this.notificationTimers.get(event.id));
        }

        // Only schedule if notification is pending
        if (event.notificationStatus !== 'pending') {
            return;
        }

        // Calculate time until notification (5 minutes before event)
        const notifyTime = new Date(event.startDate).getTime() - (5 * 60 * 1000);
        const now = new Date().getTime();
        const delay = notifyTime - now;

        // Only schedule if the notification time is in the future
        if (delay > 0) {
            const timer = setTimeout(() => {
                this.sendNotification(event);
            }, delay);

            this.notificationTimers.set(event.id, timer);
        }
    }

    sendNotification(event: Event) {
        // Update notification status
        this.eventsService.update(event.id, { notificationStatus: 'sent' });

        // Send WebSocket notification
        this.eventsGateway.sendNotification(event);
    }

    snoozeNotification(eventId: string) {
        const event = this.eventsService.findById(eventId);
        if (!event) return;

        // Update status
        this.eventsService.update(eventId, { notificationStatus: 'snoozed' });

        // Reschedule notification for 5 minutes later
        const timer = setTimeout(() => {
            this.sendNotification(event);
        }, 5 * 60 * 1000);

        this.notificationTimers.set(eventId, timer);
    }

    dismissNotification(eventId: string) {
        // Update status to dismissed
        this.eventsService.update(eventId, { notificationStatus: 'dismissed' });

        // Clear any existing timers
        if (this.notificationTimers.has(eventId)) {
            clearTimeout(this.notificationTimers.get(eventId));
            this.notificationTimers.delete(eventId);
        }
    }

    cancelNotification(eventId: string) {
        // Clear any existing timers
        if (this.notificationTimers.has(eventId)) {
            clearTimeout(this.notificationTimers.get(eventId));
            this.notificationTimers.delete(eventId);
        }
    }
    // Add this method to your NotificationService class
    testNotification() {
        // Find any event
        const events = this.eventsService.findAll();
        if (events.length > 0) {
            const event = events[0];
            console.log('Sending test notification for event:', event.title);
            this.sendNotification(event);
            return true;
        }
        return false;
    }
}