import { IsString } from 'class-validator';

export class CreateRunConfigDto {
  key: string;
  value: string;
}
