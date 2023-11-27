import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsEntity } from './entities/posts.entity';
import { FindOptionsWhere, LessThan, MoreThan, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostResponeDto } from './dto/post-respone.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { request } from 'express';
import { HOST, PROTOCOL } from '../common/const/env.const';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsEntity)
    private postsRepository: Repository<PostsEntity>,
  ) {}

  async create(request: CreatePostDto) {
    // 객체를 먼저 생성하고 저장한다.
    const createdPost = this.postsRepository.create(request);
    await this.postsRepository.save(createdPost);
    // 응답객체로 변환하여 제공
    return new PostResponeDto(createdPost);
  }

  async findAll() {
    // 전체조회: find()
    // 단거조회: findOne()
    const posts = await this.postsRepository.find();
    return posts.map((post) => new PostResponeDto(post));
  }

  // 1) 오름차순으로 정렬하는 pagination 구현
  async paginatePosts(request: PaginatePostDto) {
    const where: FindOptionsWhere<PostsEntity> = {};

    if (request.where__id_less_than) {
      where.id = LessThan(request.where__id_less_than);
    } else if (request.where__id_more_than) {
      where.id = MoreThan(request.where__id_more_than);
    }

    // 1, 2, 3, 4, 5
    const posts = await this.postsRepository.find({
      where,
      order: {
        createdAt: request.order__createdAt,
      },
      take: request.take,
    });

    // 해당되는 포스트가 0개 이상이면
    // 마지막 포스트를 가져오고
    // 아니면 null을 반환한다.
    const lastItem = posts.length > 0 && posts.length === request.take ? posts[posts.length - 1] : null;

    const nextURL = lastItem && new URL(`${PROTOCOL}://${HOST}/posts`);

    if (nextURL) {
      /**
       * dto의 키값들을 루핑하면서
       * 키값에 해당하는 값이 존재하면
       * param에 그대로 붙여넣는다.
       *
       * 단 where__id_more_than 값 만 lastItem의 마지막 값으로 넣어준다.
       */
      for (const key of Object.keys(request)) {
        if (request[key]) {
          if (key !== 'where__id_more_than' && key !== 'where__id_less_than') {
            nextURL.searchParams.append(key, request[key]);
          }
        }
      }

      let key = null;

      if (request.order__createdAt === 'ASC') {
        key = 'where__id_more_than';
      } else {
        key = 'where__id_less_than';
      }

      nextURL.searchParams.append(key, lastItem.id.toString());
    }

    /**
     * Response
     *
     * data: Data[],
     * cursor: {
     *   after: 마지막 Data의 ID
     * },
     * count: 응답한 데이터의 개수
     * next: 다음 요청을 할때 사용할 URL
     */
    return {
      data: posts,
      cursor: {
        after: lastItem?.id ?? null,
      },
      count: posts.length,
      next: nextURL?.toString() ?? null,
    };
  }

  async generatePosts() {
    for (let i = 0; i < 100; i++) {
      await this.create({
        title: `테스트 포스트 ${i}`,
        content: `테스트 내용 ${i}`,
        author: `테스트 작성자${i}@gmail.com`,
      });
    }
  }

  async findById(id: number) {
    const post = await this.postsRepository.findOne({
      where: {
        id,
      },
    });

    if (!post) {
      throw new NotFoundException('데이터를 찾을 수 없습니다.');
    }

    return post;
  }

  async delete(id: number) {
    const foundPost = await this.postsRepository.findOne({
      where: {
        id,
      },
    });

    if (!foundPost) {
      throw new NotFoundException('데이터를 찾을 수 없습니다.');
    }

    return await this.postsRepository.delete(id);
  }

  async update(id: number, updateRequest: UpdatePostDto) {
    const foundPost = await this.postsRepository.findOne({
      where: {
        id,
      },
    });

    if (!foundPost) {
      throw new NotFoundException('데이터를 찾을 수 없습니다.');
    }

    // Object.assign(foundPost, updateRequest);
    foundPost.title = updateRequest.title;
    foundPost.content = updateRequest.content;
    return await this.postsRepository.save(foundPost);
  }
}
