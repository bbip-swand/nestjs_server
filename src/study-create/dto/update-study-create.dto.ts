import { PartialType } from '@nestjs/swagger';
import { StudyInfoDto } from './create-study.dto';

export class UpdateStudyCreateDto extends PartialType(StudyInfoDto) {}
