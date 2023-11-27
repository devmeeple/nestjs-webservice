import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../src/app.module';
import * as request from 'supertest';
import { CreatePostDto } from '../../../src/posts/dto/create-post.dto';
import { Repository } from 'typeorm';
import { PostsEntity } from '../../../src/posts/entities/posts.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UpdatePostDto } from '../../../src/posts/dto/update-post.dto';

describe('Posts (e2e)', () => {
  let app: INestApplication;
  let postsRepository: Repository<PostsEntity>;
  const requestPost: CreatePostDto = {
    title: '게시물 작성 테스트 제목1',
    content: '게시물 작성 테스트 내용1',
    author: 'devmeeple@gmail.com',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe()); // class validation

    await app.init();

    // 레포지토리 가져오기
    postsRepository = moduleFixture.get<Repository<PostsEntity>>(
      getRepositoryToken(PostsEntity),
    );
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

  it('[POST:유효성 검증] /posts', async () => {
    // given
    const badPost = {
      title: '', // 제목은 필수입니다.
      content: '이 테스트는 실패합니다.',
      author: 'devmeeple@gmail.com',
    };

    // when
    const response = await request(app.getHttpServer())
      .post('/posts')
      .send(badPost)
      .expect(HttpStatus.BAD_REQUEST);

    // then
    expect(response.body.message).toContain('제목은 필수입니다.');
  });

  it('[GET:전체조회] /posts', async () => {
    // 데이터베이스에 있는 게시글들을 전체조회하여 확인한다.
    // given

    // when GET 요청을 보내고 응답을 확인한다.
    const response = await request(app.getHttpServer())
      .get('/posts')
      .expect(HttpStatus.OK);

    // then
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  it('[GET:단건조회] /posts/:id', async () => {
    // given
    const savedPost = await postsRepository.save(requestPost);

    // when
    const response = await request(app.getHttpServer())
      .get(`/posts/${savedPost.id}`)
      .expect(HttpStatus.OK);

    // then
    expect(response.body).toHaveProperty('id', savedPost.id);
    expect(response.body.title).toEqual(requestPost.title);
    expect(response.body.content).toEqual(requestPost.content);
    expect(response.body.author).toEqual(requestPost.author);
  });

  it('[DELETE:삭제] /posts/:id', async () => {
    // given
    const savedPost = await postsRepository.save(requestPost);

    // when
    const response = await request(app.getHttpServer())
      .delete(`/posts/${savedPost.id}`)
      .expect(HttpStatus.OK);

    // then
    const postInDb = await postsRepository.findOne({
      where: {
        id: savedPost.id,
      },
    });
    expect(postInDb).toBeNull();
  });

  it('[PUT:수정] /posts/:id', async () => {
    // given
    const updatedPost: UpdatePostDto = {
      title: '수정된 게시글 제목',
      content: '수정된 게시글 내용',
    };
    const savedPost = await postsRepository.save(requestPost);

    // when
    const response = await request(app.getHttpServer())
      .put(`/posts/${savedPost.id}`)
      .send(updatedPost)
      .expect(HttpStatus.OK);

    // then
    expect(response.body.title).toEqual(updatedPost.title);
    expect(response.body.content).toEqual(updatedPost.content);
  });

  it('[PUT:유효성 검증 실패] /posts/:id', async () => {
    // given
    const invalidUpdate: UpdatePostDto = {
      title: '',
      content: '',
    };

    const savedPost = await postsRepository.save(requestPost);

    // when
    await request(app.getHttpServer())
      .put(`/posts/${savedPost.id}`)
      .send(invalidUpdate)
      .expect(HttpStatus.BAD_REQUEST);

    // then
  });
});
