import {Controller, Get, Query} from '@nestjs/common';
import {HelloResponseDto} from './dto/hello-response.dto';

@Controller('hello')
export class HelloController {

    @Get()
    hello() {
       return 'hello';
    }

    @Get('/dto')
    helloDto(@Query('name') name: string, @Query('amount') amount: number) {
        // nestjs: @Query / spring: @RequestParam
        return new HelloResponseDto(name, amount);
    }
}