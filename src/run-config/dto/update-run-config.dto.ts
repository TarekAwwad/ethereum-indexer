import { PartialType } from '@nestjs/mapped-types';
import { CreateRunConfigDto } from './create-run-config.dto';

export class UpdateRunConfigDto extends PartialType(CreateRunConfigDto) {
  key: string;
  value: string;
}
