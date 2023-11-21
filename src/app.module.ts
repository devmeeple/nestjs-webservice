import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloController } from './hello/hello.controller';
import { PostsModule } from './posts/posts.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {PostsEntity} from './posts/entities/posts.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [ PostsEntity],
      synchronize: true,
      // logging: true, // spring.jpa.show_sql=true
    }),
    PostsModule,
  ],
  controllers: [AppController, HelloController],
  providers: [AppService],
})
export class AppModule {}
