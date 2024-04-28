import { Exclude, Expose } from 'class-transformer';

/**
 * 문제 2 응답 DTO
 */
export class DayOfWeekResponseDto {
  @Exclude()
  private readonly _dayOfWeek: string;

  constructor(date: string) {
    this._dayOfWeek = date;
  }

  @Expose()
  get dayOfWeek(): string {
    return this._dayOfWeek;
  }
}
