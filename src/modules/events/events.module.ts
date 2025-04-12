// src/events/events.module.ts
import { Module } from '@nestjs/common';
import { EventsController } from './controller/events.controller';
import { EventsService } from './services/event.services';

@Module({
    controllers: [EventsController],
    providers: [EventsService],
})
export class EventsModule { }