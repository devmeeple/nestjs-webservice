import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put, Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(@Body() request: CreatePostDto) {
    return this.postsService.create(request);
  }

  @Get()
  async findAll(@Query() query: PaginatePostDto) {
    // return this.postsService.findAll();
    return this.postsService.paginatePosts(query);
  }

  @Post('random')
  async postPostRandom() {
    await this.postsService.generatePosts();
    return '성공적으로 작성되었습니다.';
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.postsService.findById(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.postsService.delete(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() request: UpdatePostDto) {
    return this.postsService.update(id, request);
  }
}
