import {HttpStatus, INestApplication} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {AppModule} from '../../../src/app.module';
import * as request from 'supertest';
import {CreatePostDto} from '../../../src/posts/dto/create-post.dto';
import {Repository} from 'typeorm';
import {PostsEntity} from '../../../src/posts/entities/posts.entity';
import {getRepositoryToken} from '@nestjs/typeorm';

describe('Posts (e2e)', () => {
    let app: INestApplication;
    let postsRepository: Repository<PostsEntity>;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        // 레포지토리 가져오기
        postsRepository = moduleFixture.get<Repository<PostsEntity>>(getRepositoryToken(PostsEntity));
    });

    afterEach(async () => {
        // 데이터베이스 초기화
        await postsRepository.clear();
    });

    afterAll(async () => {
        await app.close();
    });

    it('[POST:게시물 작성] /posts', async () => {
        // given
        const requestPost: CreatePostDto = {
            title: '게시물 작성 테스트 제목1',
            content: '게시물 작성 테스트 내용1',
            author: 'devmeeple@gmail.com',
        };

        // when
        const response = await request(app.getHttpServer())
            .post('/posts')
            .send(requestPost)
            .expect(HttpStatus.CREATED);

        // then
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toEqual(requestPost.title);
        expect(response.body.content).toEqual(requestPost.content);
        expect(response.body.author).toEqual(requestPost.author);
    });

    it('[GET:전체조회] /posts', async () => {
        // 데이터베이스에 있는 게시글들을 전체조회하여 확인한다.
        // given

        // when GET 요청을 보내고 응답을 확인한다.
        const response = await request(app.getHttpServer())
            .get('/posts')
            .expect(HttpStatus.OK)

        // then
        expect(Array.isArray(response.body)).toBeTruthy();

    });
});