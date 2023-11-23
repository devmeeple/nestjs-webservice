import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {PostsEntity} from './entities/posts.entity';
import {Repository} from 'typeorm';
import {CreatePostDto} from './dto/create-post.dto';
import {UpdatePostDto} from './dto/update-post.dto';
import {PostResponeDto} from './dto/post-respone.dto';

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
        // 응답객체로 변환하여 제공
        return new PostResponeDto(createdPost);
    }

    async findAll() {
        // 전체조회: find()
        // 단거조회: findOne()
        const posts = await this.postsRepository.find();
        return posts.map(post => new PostResponeDto(post));
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

    async update(id: number, updateRequest: UpdatePostDto ) {
        const foundPost = await this.postsRepository.findOne({
            where: {
                id,
            }
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
