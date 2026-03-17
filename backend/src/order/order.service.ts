import { BadRequestException, Inject, Injectable, LoggerService } from '@nestjs/common';
import { IFilmsRepository } from '../films/repository/films.typeorm.repository';
import { CreateOrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @Inject('FILMS_REPOSITORY')
    private readonly filmRepository: IFilmsRepository,
    @Inject('APP_LOGGER') 
    private readonly logger: LoggerService,
  ) {}

  async createOrder(order: CreateOrderDto) {
    this.logger.log('Начало создания заказа', { tickets: order.tickets.length });

    for (const ticket of order.tickets) {
      const film = await this.filmRepository.findScheduleById(ticket.film);

      if (!film) {
        this.logger.error('Фильм не найден', { filmId: ticket.film });
        throw new BadRequestException('Фильм не найден');
      }

      const session = film.find((s) => s.id === ticket.session);
      if (!session) {
        this.logger.error('Сеанс не найден', { session: ticket.session });
        throw new BadRequestException('Сеанс не найден');
      }

      const seatKey = `${ticket.row}:${ticket.seat}`;

      if (session.taken.includes(seatKey)) {
        this.logger.error(`Место ${seatKey} уже занято`, { seats: session.taken});
        throw new BadRequestException(`Место ${seatKey} уже занято`);
      }
    }

    for (const ticket of order.tickets) {
      const seatKey = `${ticket.row}:${ticket.seat}`;
      await this.filmRepository.updateTakenSeats(
        ticket.film,
        ticket.session,
        seatKey,
      );
    }

    this.logger.log('Заказ успешно завершен')
    return {
      total: order.tickets.length,
      items: order.tickets,
    };
  }
}
