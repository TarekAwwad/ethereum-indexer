import { IsInt, IsNotEmpty, IsString, Matches } from 'class-validator';

const hashRegEx = /^[a-fA-F0-9]{64}$/;

export class CreateBlockDto {
  @IsString()
  @IsNotEmpty()
  @Matches(hashRegEx, {
    message: 'Hash must be a valid 64 character long hexadecimal string.',
  })
  hash: string;

  @IsInt()
  height: number;
}
