import { Test, TestingModule } from '@nestjs/testing';
import { MissionController } from './mission.controller';

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

  it('두 수를 입력하면 덧셈, 뺄셈, 곱셈 결과를 반환한다', () => {
    // given
    const num1 = 5;
    const num2 = 10;
    const result = {
      add: num1 + num2,
      minus: num1 - num2,
      multiply: num1 * num2,
    };

    // when
    const act = sut.getCalc(num1, num2);

    // then
    expect(act).toEqual(result);
  });
});
