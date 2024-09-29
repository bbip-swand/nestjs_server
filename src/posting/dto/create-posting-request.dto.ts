import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreatePostingRequestDto {
  @Expose()
  @ApiProperty({ description: '스터디 uuid', type: String })
  studyId: string;

  @Expose()
  @ApiProperty({ description: '제목', type: String })
  title: string;

  @Expose()
  @ApiProperty({ description: '주차', type: Number })
  week: number;

  @Expose()
  @ApiProperty({ description: '내용', type: String })
  content: string;

  @Expose()
  @ApiProperty({
    description: '공지가 아닌 글 생성시 필수 X',
    type: Boolean,
    default: false,
  })
  isNotice: boolean = false;
}
