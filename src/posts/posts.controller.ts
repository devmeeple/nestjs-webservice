import {Body, Controller, Get, Post} from '@nestjs/common';
import { PostsService } from './posts.service';
import {CreatePostDto} from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(@Body() request: CreatePostDto) {
    return this.postsService.create(request);
  }

  @Get()
  async findAll() {
    return this.postsService.findAll();
  }
}
