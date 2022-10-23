import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Producer as KafkaProducer } from '@nestjs/microservices/external/kafka.interface';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway()
export class RoutesGateway implements OnModuleInit {
  private kafkaProducer: KafkaProducer;

  constructor(
    @Inject('KAFKA_SERVICE') // same name as route module client name
    private kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.kafkaProducer = await this.kafkaClient.connect();
  }

  @SubscribeMessage('new-direction')
  handleMessage(client: any, payload: any) {
    console.log(payload);
    // this.kafkaProducer.send({
    //   topic: 'route.new-direction',
    //   messages: [
    //     {
    //       key: 'route.new-direction',
    //       value: JSON.stringify({ routeId: id, clientId: id }),
    //     },
    //   ],
    // });
  }
}
