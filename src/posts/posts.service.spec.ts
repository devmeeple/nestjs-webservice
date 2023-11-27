import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PostsEntity } from './entities/posts.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('PostsService 단위테스트(Unit Test)', () => {
  let service: PostsService;
  let mockRepository: Partial<Repository<PostsEntity>>; // Partial?
  const post = {
    id: 1,
    title: '테스트 게시글',
    content: '테스트 내용',
    author: 'devmeeple@gmail.com',
  };

  beforeEach(async () => {
    const mockPosts = []; // 테스트 데이터를 저장하기 위한 배열

    // 필요한 메소드 모킹
    mockRepository = {
      create: jest.fn().mockImplementation((post) => {
        return { id: mockPosts.length + 1, ...post };
      }),
      save: jest.fn().mockImplementation((post) => {
        // index 조회하여 이미 있으면 업데이트, 없으면 새로 추가
        const index = mockPosts.findIndex((p) => p.id === post.id);
        if (index === -1) {
          mockPosts.push(post);
        } else {
          mockPosts[index] = post;
        }
        return Promise.resolve(post);
      }),
      find: jest.fn().mockImplementation(() => Promise.resolve(mockPosts)),
      findOne: jest.fn().mockImplementation((condition) => {
        return Promise.resolve(
          mockPosts.find((post) => post.id === condition.where.id),
        );
      }),
      delete: jest.fn().mockImplementation((id) => {
        const index = mockPosts.findIndex((post) => post.id === id);
        if (index === -1) {
          throw new NotFoundException('데이터를 찾을 수 없습니다.');
        }
        mockPosts.splice(index, 1);
        return Promise.resolve({ affected: 1 });
      }),
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

  it('[작성&저장] 작성된 게시글을 확인한다', async () => {
    // given
    const createdPost = await service.create(post);

    // when
    // 1) 게시물을 작성한다. service.create()
    // 2) 찾은 게시물을 전체조회한다. service.findAll()
    const posts = await service.findAll();

    // then
    // 정상적으로 조회되었는지 확인한다.
    expect(posts).toContainEqual(createdPost);
  });

  it('[단건조회] 게시물을 찾는다', async () => {
    // given
    const createdPost = await service.create(post);

    // when
    const foundPost = await service.findById(createdPost.id);

    // then
    expect(foundPost).toEqual(createdPost);
  });

  it('[단건조회] 없는 게시물을 찾으면 에러를 반환한다', async () => {
    const badId = 999;

    try {
      await service.findById(badId);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('데이터를 찾을 수 없습니다.');
    }
  });

  it('[삭제] ID로 게시물을 찾고 게시물을 삭제한다', async () => {
    // given
    const createdPost = await service.create(post);

    // when
    const deletedPost = await service.delete(createdPost.id);

    // then
    const posts = await service.findAll();
    expect(posts).not.toContainEqual(deletedPost);
    expect(deletedPost.affected).toEqual(1);
  });

  it('[업데이트] 게시물을 수정한다', async () => {
    // given
    const createdPost = await service.create(post);
    const updateRequest = {
      title: '수정된 게시글 제목',
      content: '수정된 게시글 내용',
    };

    // when
    const updatedPost = await service.update(createdPost.id, updateRequest);

    // then
    expect(updatedPost.title).toEqual(updateRequest.title);
    expect(updatedPost.content).toEqual(updateRequest.content);
  });
});
