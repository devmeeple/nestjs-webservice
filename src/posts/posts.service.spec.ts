import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import {getRepositoryToken} from '@nestjs/typeorm';
import {PostsEntity} from './entities/posts.entity';
import {Repository} from 'typeorm';

describe('PostsService 단위테스트(Unit Test)', () => {
  let service: PostsService;
  let mockRepository: Partial<Repository<PostsEntity>>; // Partial?

  beforeEach(async () => {
    const mockPosts = []; // 테스트 데이터를 저장하기 위한 배열

    // 필요한 메소드 모킹
    mockRepository = {
      create: jest.fn().mockImplementation(post => post),
      save: jest.fn().mockImplementation(post => {
        mockPosts.push(post);
        return Promise.resolve(post);
      }),
      find: jest.fn().mockImplementation(() => Promise.resolve(mockPosts)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
          PostsService,
          {
            provide: getRepositoryToken(PostsEntity),
            useValue: mockRepository,
          },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('게시글 저장 확인하기', async () => {
    // given
    const post = {
      title: '테스트 게시글',
      content: '테스트 본문',
      author: 'devmeeple@gmail.com'
    }

    // when
    // 1) 게시물을 작성한다. service.create()
    // 2) 찾은 게시물을 전체조회한다. service.findAll()
    const createdPost = await service.create(post);
    const posts = await service.findAll();

    // then
    // 정상적으로 조회되었는지 확인한다.
    expect(posts).toContainEqual(createdPost);
  });
});
