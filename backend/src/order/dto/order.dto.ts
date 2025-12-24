import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsDateString,
  IsEmail,
  Min,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class TicketDto {
  @IsUUID()
  film: string;

  @IsUUID()
  session: string;

  @IsDateString()
  daytime: string;

  @IsNumber()
  @Min(1)
  row: number;

  @IsNumber()
  @Min(1)
  seat: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsUUID()
  id?: string;
}

export class CreateOrderDto {
  @IsEmail({}, { message: 'Некорректный email' })
  email: string;

  @IsString()
  phone: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TicketDto)
  tickets: TicketDto[];
}
