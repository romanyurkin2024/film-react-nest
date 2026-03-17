import { Body, Controller, Inject, LoggerService, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService, 
    @Inject('APP_LOGGER') private readonly logger: LoggerService
  ) {
  }

  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    this.logger.log('POST /order - запрос на создание заказа', { body: createOrderDto });
    return this.orderService.createOrder(createOrderDto);
  }
}
