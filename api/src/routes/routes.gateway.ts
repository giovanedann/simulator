import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Producer as KafkaProducer } from '@nestjs/microservices/external/kafka.interface';
import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class RoutesGateway implements OnGatewayInit {
  private kafkaProducer: KafkaProducer;

  @WebSocketServer()
  server: Server;

  constructor(
    @Inject('KAFKA_SERVICE') // same name as route module client name
    private kafkaClient: ClientKafka,
  ) {}

  async afterInit() {
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

  async sendPosition(data: {
    clientId: string;
    routeId: string;
    position: [number, number];
    finished: boolean;
  }) {
    const { clientId, ...info } = data;

    const clients = await this.server.sockets.fetchSockets();

    if (!clients.map((client) => client.id).includes(clientId)) {
      console.error(
        'Client does not exists, refresh React Application and resend new direction again.',
      );
      return;
    }

    clients.find((client) => client.id === clientId).emit('new-position', info);
  }
}
