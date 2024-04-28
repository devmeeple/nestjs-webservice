import { IsNumber } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

/**
 * API 응답 DTO
 * @Exclude: 보여주고 싶지 않은 정보
 */
export class CalcResponseDto {
  @IsNumber()
  @Exclude()
  private readonly _add: number;

  @IsNumber()
  @Exclude()
  private readonly _minus: number;

  @IsNumber()
  @Exclude()
  private readonly _multiply: number;

  constructor(add: number, minus: number, multiply: number) {
    this._add = add;
    this._minus = minus;
    this._multiply = multiply;
  }

  @Expose()
  get add(): number {
    return this._add;
  }

  @Expose()
  get minus(): number {
    return this._minus;
  }

  @Expose()
  get multiply(): number {
    return this._multiply;
  }
}
