import { IsNumber } from 'class-validator';

export class SumRequestDto {
  @IsNumber({}, { each: true })
  numbers: number[];

  constructor(numbers: number[]) {
    this.numbers = numbers;
  }
}
