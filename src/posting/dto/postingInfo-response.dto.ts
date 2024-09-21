import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PostingResponseDto {
  @Expose()
  @ApiProperty({ description: '스터디 이름', type: String })
  studyName: string;

  @Expose()
  @ApiProperty({ description: '게시글 uuid', type: String })
  postingId: string;

  @Expose()
  @ApiProperty({ description: '작성자 dbUserId', type: Number })
  writer: number;

  @Expose()
  @ApiProperty({ description: '제목', type: String })
  title: string;

  @Expose()
  @ApiProperty({ description: '내용', type: String })
  content: string;

  @Expose()
  @ApiProperty({ description: '공지사항 여부', type: Boolean })
  isNotice: boolean;

  @Expose()
  @ApiProperty({ description: '생성 날짜', type: Date })
  createdAt: Date;
}
