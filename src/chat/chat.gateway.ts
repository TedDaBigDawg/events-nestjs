import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { Injectable, Logger } from '@nestjs/common';
  import { ChatService } from './chat.service'; // Service to handle DB operations
  
  @Injectable()
  @WebSocketGateway({
    cors: {
      origin: [
        'http://localhost:3000',
        'http://localhost:3001',
      ],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  })
  export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    private readonly logger = new Logger(ChatGateway.name);
    private chatRooms: Record<string, string[]> = {};
  
    constructor(private readonly chatService: ChatService) {}
  
    // Gateway lifecycle hooks
    afterInit(server: Server) {
      this.logger.log('WebSocket server initialized');
    }
  
    handleConnection(client: Socket) {
      this.logger.log(`Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      this.logger.log(`Client disconnected: ${client.id}`);
    }
  
    // Event: Join a room
    @SubscribeMessage('joinRoom')
    async handleJoinRoom(
      @MessageBody() data: { eventId: string; attendeeId: string },
      @ConnectedSocket() client: Socket,
    ) {
      const { eventId, attendeeId } = data;
  
      client.join(eventId);
  
      if (!this.chatRooms[eventId]) {
        this.chatRooms[eventId] = [];
      }
      this.chatRooms[eventId].push(attendeeId);
  
      this.logger.log(`Attendee ${attendeeId} joined room ${eventId}`);
    }
  
    // Event: Leave a room
    @SubscribeMessage('leaveRoom')
    async handleLeaveRoom(
      @MessageBody() data: { eventId: string; attendeeId: string },
      @ConnectedSocket() client: Socket,
    ) {
      const { eventId, attendeeId } = data;
  
      client.leave(eventId);
  
      if (this.chatRooms[eventId]) {
        this.chatRooms[eventId] = this.chatRooms[eventId].filter((id) => id !== attendeeId);
        this.logger.log(`Attendee ${attendeeId} left room ${eventId}`);
      }
    }
  
    // Event: Send a message
    @SubscribeMessage('sendMessage')
    async handleSendMessage(
      @MessageBody() data: { chatroomId: string; attendee_id: string; message: string },
    ) {
      const { chatroomId, attendee_id, message } = data;
  
      // Broadcast to everyone in the room
      this.server.to(chatroomId).emit('receiveMessage', { attendee_id, message });
  
      const dto = {
        attendee_id,
        message
      }
      // Store the message in the database
      await this.chatService.sendMessage(chatroomId, dto);
  
      this.logger.log(`Message from attendee ${attendee_id} in room ${chatroomId}: ${message}`);
    }
  }
  