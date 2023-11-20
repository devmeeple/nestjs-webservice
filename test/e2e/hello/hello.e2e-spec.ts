import {HttpStatus, INestApplication} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {AppModule} from '../../../src/app.module';
import * as request from 'supertest';

describe('Hello', () => {
    let app: INestApplication;

    // Nest 런타임을 모의하는 실행 컨텍스트 초기화
    // compile 비동기
    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('[GET] /hello ', () => {
        // given
        
        // when
        
        // then
        return request(app.getHttpServer())
            // 1. get 요청을 보낸다.
            // 2. HTTP Header의 Status가 OK(200)인지 확인
            // 3. response.body(응답 본문)이 hello 인지 확인
            .get('/hello')
            .expect(HttpStatus.OK)
            .expect('hello');
    });

    it('[GET] /hello/dto', () => {
        // given
        const name = 'hello';
        const amount = 1000;

        // when + then => expect
        return request(app.getHttpServer())
            .get(`/hello/dto?name=${name}&amount=${amount}`)
            .expect(HttpStatus.OK)
            .expect((res) => {
                expect(res.body).toEqual({
                    name,
                    amount: amount.toString(),
                });
            });
    });
});