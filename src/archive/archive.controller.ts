import { Get, Param, Request } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { MemberJwtController } from 'src/utils/decorators/jwt-controller';
import { ArchiveService } from './archive.service';

@MemberJwtController('archive')
export class ArchiveController {
  constructor(private readonly archiveService: ArchiveService) {}
  @Get('/:studyId')
  @ApiOperation({ summary: '스터디 자료 아카이브 조회' })
  async getArchive(@Param('studyId') studyId: string, @Request() req) {
    return this.archiveService.getArchive(studyId, req.user);
  }
}
