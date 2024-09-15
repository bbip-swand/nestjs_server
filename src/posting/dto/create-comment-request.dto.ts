import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreateCommentRequestDto {
  @Expose()
  @ApiProperty({ description: '댓글 내용', type: String })
  content: string;
}
