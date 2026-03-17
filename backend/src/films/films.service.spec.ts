import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { describe, beforeEach, it, expect, jest } from '@jest/globals';

describe('FilmsService', () => {
  let service: FilmsService;
  let repository: any;
  let mockLogger: any;

  
  const mockFilmsRepository = {
    findAll: jest.fn(),
    findScheduleById: jest.fn(),
  };

  beforeEach(async () => {
    mockLogger = {
      log: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        {
          provide: 'FILMS_REPOSITORY',
          useValue: mockFilmsRepository,
        },
        {
          provide: 'APP_LOGGER',
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
    repository = module.get('FILMS_REPOSITORY');
  });

  it('Должен быть определен', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('Должен вернуть список фильмов с их количеством', async () => {
      const mockFilms = [
        { id: '1', title: 'Avatar 3' },
        { id: '2', title: 'Avatar' },
      ];
      repository.findAll.mockResolvedValue(mockFilms);

      const result = await service.findAll();

      expect(result).toEqual({
        total: 2,
        items: mockFilms,
      });
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });

    it('Должен вернуть пустой список, если фильмов нет', async () => {
      repository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual({ total: 0, items: [] });
    });
  });

  describe('findScheduleById', () => {
    it('Должен вернуть расписание для конкретного фильма', async () => {
      const filmId = 'uuid-123';
      const mockSchedule = [{ id: 's1', daytime: '10:00' }];
      repository.findScheduleById.mockResolvedValue(mockSchedule);

      const result = await service.findScheduleById(filmId);

      expect(result).toEqual({
        total: 1,
        items: mockSchedule,
      });
      expect(repository.findScheduleById).toHaveBeenCalledWith(filmId);
    });
  });
});
