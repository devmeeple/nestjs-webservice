import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '../../common/entity/base-time.entity';

@Entity()
export class PostsEntity extends BaseTimeEntity{
  // 기본으로 언더스코어 네이밍되어 테이블 이름을 매칭
  // @PrimaryGeneratedColumn()
  // id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  author: string;
}
