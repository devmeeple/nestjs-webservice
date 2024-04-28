import { Test, TestingModule } from '@nestjs/testing';
import { MissionController } from './mission.controller';
import { CalcRequestDto } from './dto/request/calc-request.dto';
import { DayOfWeekRequestDto } from './dto/request/day-of-week-request.dto';
import { SumRequestDto } from './dto/request/sum-request.dto';

describe('MissionController', () => {
  let sut: MissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MissionController],
    }).compile();

    sut = module.get<MissionController>(MissionController);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('덧셈, 뺄셈, 곱셈 결과를 반환한다', () => {
    // given
    const request = new CalcRequestDto(10, 5);

    // when
    const act = sut.getCalc(request);

    // then
    expect(act).toBeDefined();
    expect(act.add).toBe(15);
    expect(act.minus).toBe(5);
    expect(act.multiply).toBe(50);
  });

  it('날짜를 입력하면, 어떤 요일인지 반환한다', () => {
    // given
    const date = new DayOfWeekRequestDto('2023-01-01');

    // when
    const act = sut.getDayOfWeek(date);

    // then
    expect(act).toBeDefined();
    expect(act.dayOfWeek).toBe('SUN');
  });

  it('숫자를 입력받아 총 합을 반환한다', () => {
    // given
    const numbers = [1, 2, 3, 4, 5];
    const request = new SumRequestDto(numbers);

    // when
    const act = sut.sumNumbers(request);

    // then
    expect(act).toBe(15);
  });
});
