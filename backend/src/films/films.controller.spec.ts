// films/films.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { describe, beforeEach, expect, jest, it } from '@jest/globals';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: FilmsService;

  const mockFilmsService = {
    findAll: jest.fn(() =>
      Promise.resolve({
        total: 1,
        items: [{ id: '1', title: 'Inception' }],
      }),
    ),
    findScheduleById: jest.fn((id: string) =>
      Promise.resolve({
        total: 1,
        items: [{ id: 's1', time: '10:00', filmId: id }],
      }),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: mockFilmsService,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    service = module.get<FilmsService>(FilmsService);
  });

  it('Должен быть определен', () => {
    expect(controller).toBeDefined();
  });

  describe('Найти все фильмы', () => {
    it('Должен вернуть все фильмы с сервиса', async () => {
      const result = await controller.findAll();

      expect(result).toEqual({
        total: 1,
        items: [{ id: '1', title: 'Inception' }],
      });

      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('Найти расписание фильма', () => {
    it('Должен вернуть расписание определенного фильма', async () => {
      const filmId = 's1';
      const result = await controller.findSchedule(filmId);

      expect(result.items[0].id).toBe(filmId);
      expect(service.findScheduleById).toHaveBeenCalledWith(filmId);
    });
  });
});
