import { Body, Get, Param, Post, Request } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
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

  @Get('/deatils/:postingId')
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
}
