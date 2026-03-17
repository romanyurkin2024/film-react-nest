import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { CreateOrderDto } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;
  let loggerMock: any;

  const mockOrderService = {
    createOrder: jest.fn((dto: CreateOrderDto) =>
      Promise.resolve({
        total: dto.tickets.length,
        items: dto.tickets,
      }),
    ),
  };

  beforeEach(async () => {
    loggerMock = { log: jest.fn() }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        { provide: OrderService, useValue: mockOrderService }, 
        { provide: 'APP_LOGGER', useValue: loggerMock}
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  it('Должен вызывать сервис для создания заказа', async () => {
    const dto = { tickets: [{ film: '1', session: 's1', row: 1, seat: 1 }] };
    const result = await controller.createOrder(dto as any);
    
    expect(loggerMock.log).toHaveBeenCalledWith(
      expect.stringContaining('POST /order - запрос на создание заказа'),
      expect.objectContaining({ body: dto }) 
    );
    expect(service.createOrder).toHaveBeenCalledWith(dto);
    expect(result.total).toBe(1);
  });
});
