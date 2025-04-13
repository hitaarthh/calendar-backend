import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Event } from '../models/event.model';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({ cors: true })
@Injectable()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private clients = new Map<string, Socket>();

    handleConnection(client: Socket) {
        console.log('Client connected:', client.id);
        this.clients.set(client.id, client);
    }

    handleDisconnect(client: Socket) {
        console.log('Client disconnected:', client.id);
        this.clients.delete(client.id);
    }

    sendNotification(event: Event) {
        console.log('Sending notification for event:', event.title);

        if (!this.server) {
            console.log('WebSocket server not initialized yet');
            return;
        }

        this.server.emit('notification', {
            id: event.id,
            title: event.title,
            time: event.startDate,
            description: event.description
        });
    }
    @SubscribeMessage('ping')
    handlePing(client: Socket) {
        console.log('Ping received from client');
        return { event: 'pong', data: 'pong from server' };
    }
}