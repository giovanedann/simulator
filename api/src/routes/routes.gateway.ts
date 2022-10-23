import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Producer as KafkaProducer } from '@nestjs/microservices/external/kafka.interface';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class RoutesGateway implements OnModuleInit {
  private kafkaProducer: KafkaProducer;

  @WebSocketServer()
  server: Server;

  constructor(
    @Inject('KAFKA_SERVICE') // same name as route module client name
    private kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.kafkaProducer = await this.kafkaClient.connect();
  }

  @SubscribeMessage('new-direction')
  handleMessage(client: Socket, payload: { routeId: string }) {
    const { routeId } = payload;
    this.kafkaProducer.send({
      topic: 'route.new-direction',
      messages: [
        {
          key: 'route.new-direction',
          value: JSON.stringify({ routeId, clientId: client.id }),
        },
      ],
    });
  }

  sendPosition(data: {
    clientId: string;
    routeId: string;
    position: [number, number];
    finished: boolean;
  }) {
    const { clientId, ...info } = data;

    const clients = this.server.sockets.allSockets;
    if (!(clientId in clients)) {
      console.error(
        'Client not exists, refresh React Application and resend new direction again.',
      );
      return;
    }
    clients[clientId].emit('new-position', info);
  }
}
