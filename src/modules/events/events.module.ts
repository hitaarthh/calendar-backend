import { Module, forwardRef } from '@nestjs/common';
import { EventsController } from './controller/events.controller';
import { EventsService } from './services/event.services';
import { EventsGateway } from './gateways/events.gateway';
import { NotificationService } from './services/notification.service';

@Module({
    controllers: [EventsController],
    providers: [
        EventsService,
        NotificationService,
        EventsGateway
    ],
    exports: [EventsService, NotificationService, EventsGateway]
})
export class EventsModule { }