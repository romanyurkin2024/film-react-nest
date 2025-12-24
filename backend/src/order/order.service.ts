import { BadRequestException, Injectable } from '@nestjs/common';
import { FilmsRepository } from 'src/repository/films.repository';
import { CreateOrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly filmRepository: FilmsRepository) {}

  async createOrder(order: CreateOrderDto) {
    for (const ticket of order.tickets) {
      const film = await this.filmRepository.findScheduleById(ticket.film);

      if (!film) {
        throw new BadRequestException('Фильм не найден');
      }

      const session = film.find((s) => s.id === ticket.session);

      if (!session) {
        throw new BadRequestException('Сеанс не найден');
      }

      const seatKey = `${ticket.row}:${ticket.seat}`;

      if (session.taken.includes(seatKey)) {
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

    return {
      total: order.tickets.length,
      items: order.tickets,
    };
  }
}
