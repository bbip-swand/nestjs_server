import { PartialType } from '@nestjs/swagger';
import { CreateStudyManageDto } from './create-study-manage.dto';

export class UpdateStudyManageDto extends PartialType(CreateStudyManageDto) {}
