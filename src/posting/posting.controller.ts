import {
  Body,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MemberJwtController } from 'src/utils/decorators/jwt-controller';
import { RestMethod } from 'src/utils/decorators/rest-method';
import { CreateCommentRequestDto } from './dto/create-comment-request.dto';
import { CreatePostingRequestDto } from './dto/create-posting-request.dto';
import { PostingResponseDto } from './dto/postingInfo-response.dto';
import { PostingService } from './posting.service';

@MemberJwtController('posting')
export class PostingController {
  constructor(private readonly postingService: PostingService) {}

  @Get('/recent')
  @ApiOperation({ summary: '최근 일주일 게시글 조회' })
  @RestMethod({
    response: PostingResponseDto,
  })
  async findRecentPosting(@Request() req) {
    return this.postingService.findRecentPosting(req.user);
  }

  @Get('/all/:studyId')
  @ApiOperation({ summary: '스터디 게시글 전체 조회' })
  @RestMethod({
    response: PostingResponseDto,
  })
  async findAllPosting(@Param('studyId') studyId: string, @Request() req) {
    return this.postingService.findAllPosting(studyId, req.user);
  }

  @Get('/details/:postingId')
  @ApiOperation({ summary: '게시글 단건 조회 (댓글까지 세부 조회)' })
  findOne(@Param('postingId') postingId: string, @Request() req) {
    return this.postingService.findOne(postingId, req.user);
  }

  @Post('create')
  @ApiOperation({ summary: '게시글 생성' })
  @RestMethod({
    request: CreatePostingRequestDto,
  })
  createPosting(
    @Body() createPostingRequestDto: CreatePostingRequestDto,
    @Request() req,
  ) {
    return this.postingService.createPosting(createPostingRequestDto, req.user);
  }

  @Post('create/comment/:postingId')
  @ApiOperation({ summary: '댓글 생성' })
  @RestMethod({
    request: CreateCommentRequestDto,
  })
  createComment(
    @Param('postingId') postingId: string,
    @Body() createCommentRequestDto: CreateCommentRequestDto,
    @Request() req,
  ) {
    return this.postingService.createComment(
      postingId,
      createCommentRequestDto.content,
      req.user,
    );
  }

  @Delete('delete/:postingId')
  @ApiOperation({ summary: '게시글 삭제' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '게시글 삭제 성공',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: '게시글 작성자가 아니기에 게시글을 삭제할 수 없습니다.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '게시글을 찾을 수 없습니다.',
  })
  deletePosting(@Param('postingId') postingId: string, @Request() req) {
    return this.postingService.deletePosting(postingId, req.user);
  }

  @Delete('delete/:commentId')
  @ApiOperation({ summary: '댓글 삭제' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '댓글 삭제 성공',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: '댓글 작성자가 아니기에 댓글을 삭제할 수 없습니다.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '댓글을 찾을 수 없습니다.',
  })
  deleteComment(@Param('commentId') commentId: number, @Request() req) {
    return this.postingService.deleteComment(commentId, req.user);
  }
}
