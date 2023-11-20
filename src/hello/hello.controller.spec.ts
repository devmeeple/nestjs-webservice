import { Test, TestingModule } from '@nestjs/testing';
import { HelloController } from './hello.controller';

describe('HelloController', () => {
  let controller: HelloController;

  beforeEach(async () => {
    // 테스트 모듈을 만들고 HelloController 만 포함시킨다.
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HelloController],
    }).compile();

    controller = module.get<HelloController>(HelloController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('[GET] /hello 요청시 hello 를 반환한다. ', () => {
    // given

    // when

    // then
    expect(controller.hello()).toBe('hello');
  });
});
