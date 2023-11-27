import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty({ message: '제목은 필수입니다.' })
  title: string;

  @IsNotEmpty()
  content: string;

  @IsEmail({}, { message: '작성자는 이메일 형식이어야 합니다.' })
  author: string;
}
