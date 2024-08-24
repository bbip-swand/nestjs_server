import { PartialType } from '@nestjs/swagger';
import { CreateStudyCreateDto } from './create-study-create.dto';

export class UpdateStudyCreateDto extends PartialType(CreateStudyCreateDto) {}
