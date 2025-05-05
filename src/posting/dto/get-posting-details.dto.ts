import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class CommentDto {
  @Expose()
  @ApiProperty({ description: '작성자 이름', type: String })
  writer: string;

  @Expose()
  @ApiProperty({ description: '관리자 여부', type: Boolean })
  isManager: boolean;

  @Expose()
  @ApiProperty({
    description: '프로필 이미지 URL',
    type: String,
    nullable: true,
  })
  profileImageUrl: string | null;

  @Expose()
  @ApiProperty({ description: '댓글 내용', type: String })
  content: string;

  @Expose()
  @ApiProperty({
    description: '댓글 생성 시간',
    type: String,
    format: 'date-time',
  })
  createdAt: string;
}

export class GetPostingDetailsResponseDto {
  @Expose()
  @ApiProperty({ description: '포스팅 UUID', type: String })
  postingId: string;

  @Expose()
  @ApiProperty({ description: '스터디 이름', type: String })
  studyName: string;

  @Expose()
  @ApiProperty({ description: '작성자 이름', type: String })
  writer: string;

  @Expose()
  @ApiProperty({ description: '관리자 여부', type: Boolean })
  isManager: boolean;

  @Expose()
  @ApiProperty({
    description: '프로필 이미지 URL',
    type: String,
    nullable: true,
  })
  profileImageUrl: string | null;

  @Expose()
  @ApiProperty({ description: '제목', type: String })
  title: string;

  @Expose()
  @ApiProperty({ description: '내용', type: String })
  content: string;

  @Expose()
  @ApiProperty({ description: '주차', type: Number })
  week: number;

  @Expose()
  @ApiProperty({
    description: '공지 여부',
    type: Boolean,
    default: false,
  })
  isNotice: boolean = false;

  @Expose()
  @ApiProperty({ description: '댓글 목록', type: [CommentDto] })
  @Type(() => CommentDto)
  comments: CommentDto[];

  @Expose()
  @ApiProperty({
    description: '게시글 생성 시간',
    type: String,
    format: 'date-time',
  })
  createdAt: string;
}
