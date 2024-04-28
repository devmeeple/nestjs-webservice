import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';

@Controller('/api/v1')
export class MissionController {
  @Get('calc')
  getCalc(
    @Query('num1', ParseIntPipe) num1: number,
    @Query('num2', ParseIntPipe) num2: number,
  ) {
    return {
      add: num1 + num2,
      minus: num1 - num2,
      multiply: num1 * num2,
    };
  }
}
