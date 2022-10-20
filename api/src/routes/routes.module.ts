import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { Route, RouteSchema } from './entities/route.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Route.name, schema: RouteSchema }]),
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        useFactory: () => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: process.env.KAFKA_CLIENT_ID,
              brokers: [process.env.KAFKA_BROKER],
            },
            consumer: {
              groupId:
                !process.env.KAFMA_CONSUMER_GROUP_ID ||
                process.env.KAFKA_CONSUMER_GROUP_ID === ''
                  ? 'my-consumer-' + Math.random()
                  : process.env.KAFKA_CONSUMER_GROUP_ID,
            },
          },
        }),
      },
    ]),
  ],
  controllers: [RoutesController],
  providers: [RoutesService],
})
export class RoutesModule {}