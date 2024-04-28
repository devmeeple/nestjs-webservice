import { Controller, Get, Query } from '@nestjs/common';
import { CalcRequestDto } from './dto/request/calc-request.dto';
import { CalcResponseDto } from './dto/response/calc-response.dto';
import { DayOfWeekRequestDto } from './dto/request/day-of-week-request.dto';
import { DayOfWeekResponseDto } from './dto/response/day-of-week-response.dto';

@Controller('/api/v1')
export class MissionController {
  @Get('calc')
  getCalc(@Query() request: CalcRequestDto) {
    const { num1, num2 } = request;

    // 덧셈, 뺄셈, 곱셈 (서비스에 구현하여 개선 가능)
    const add = num1 + num2;
    const minus = num1 - num2;
    const multiply = num1 * num2;

    return new CalcResponseDto(add, minus, multiply);
  }

  @Get('day-of-the-week')
  getDayOfWeek(@Query() request: DayOfWeekRequestDto) {
    const week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const dateIndex = new Date(request.date).getDay();
    return new DayOfWeekResponseDto(week[dateIndex]);
  }
}
