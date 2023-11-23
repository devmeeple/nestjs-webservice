import {PostsEntity} from '../entities/posts.entity';

export class PostResponeDto {
    id: number;
    title: string;
    content: string;
    author: string;

    constructor(entity: PostsEntity) {
        this.id = entity.id;
        this.title = entity.title;
        this.content = entity.content;
        this.author = entity.author;
    }
}