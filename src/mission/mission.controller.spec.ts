import { Test, TestingModule } from '@nestjs/testing';
import { MissionController } from './mission.controller';
import { CalcRequestDto } from './dto/request/calc-request.dto';

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
});
