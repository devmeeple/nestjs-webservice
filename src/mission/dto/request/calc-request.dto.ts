import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * API 요청 DTO
 */
export class CalcRequestDto {
  @Type(() => Number)
  @IsNumber()
  num1: number;

  @Type(() => Number)
  @IsNumber()
  num2: number;

  constructor(num1: number, num2: number) {
    this.num1 = num1;
    this.num2 = num2;
  }
}
