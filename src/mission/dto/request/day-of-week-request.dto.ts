import { IsDateString, MaxLength } from 'class-validator';

export class DayOfWeekRequestDto {
  @MaxLength(10)
  @IsDateString()
  date: string;

  constructor(date: string) {
    this.date = date;
  }
}
