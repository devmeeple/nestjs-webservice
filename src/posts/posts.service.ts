import { Injectable } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {PostsEntity} from './entities/posts.entity';
import {Repository} from 'typeorm';
import {CreatePostDto} from './dto/create-post.dto';

@Injectable()
export class PostsService {

    constructor(
        @InjectRepository(PostsEntity)
        private postsRepository: Repository<PostsEntity>
    ) {}

    async create(request: CreatePostDto) {
        // 객체를 먼저 생성하고 저장한다.
        const createdPost = this.postsRepository.create(request);
        await this.postsRepository.save(createdPost);
        return createdPost;
    }

    async findAll() {
        // 전체조회: find()
        // 단거조회: findOne()
        return await this.postsRepository.find();
    }
}
