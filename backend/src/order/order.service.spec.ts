import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { BadRequestException } from '@nestjs/common';
import { describe, beforeEach, it, expect, jest } from '@jest/globals';

describe('OrderService', () => {
  let service: OrderService;
  let repository: any;

  const mockRepository = {
    findScheduleById: jest.fn(),
    updateTakenSeats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: 'FILMS_REPOSITORY', useValue: mockRepository },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    repository = module.get('FILMS_REPOSITORY');
  });

  it('Должен успешно создать заказ, если места свободны', async () => {
    const orderDto = { tickets: [{ film: 'f1', session: 's1', row: 1, seat: 5 }] };
    
    repository.findScheduleById.mockResolvedValue([{ id: 's1', taken: [] }]);

    const result = await service.createOrder(orderDto as any);

    expect(result.total).toBe(1);
    expect(repository.updateTakenSeats).toHaveBeenCalledWith('f1', 's1', '1:5');
  });

  it('Должен выбросить ошибку, если место уже занято', async () => {
    const orderDto = { tickets: [{ film: 'f1', session: 's1', row: 1, seat: 5 }] };
    
    // Место 1:5 уже в списке занятых
    repository.findScheduleById.mockResolvedValue([{ id: 's1', taken: ['1:5'] }]);

    await expect(service.createOrder(orderDto as any)).rejects.toThrow(
      new BadRequestException('Место 1:5 уже занято'),
    );
  });

  it('Должен выбросить ошибку, если фильм не найден', async () => {
    repository.findScheduleById.mockResolvedValue(null);

    const orderDto = { tickets: [{ film: 'non-existent', session: 's1', row: 1, seat: 1 }] };

    await expect(service.createOrder(orderDto as any)).rejects.toThrow(
      new BadRequestException('Фильм не найден'),
    );
  });
})