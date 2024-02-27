import { IsInt, IsNotEmpty, IsString, Matches, IsEnum } from 'class-validator';

const hashRegEx = /^[a-fA-F0-9]{64}$/;
const addressRegEx = /^[a-fA-F0-9]{40}$/;

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  @Matches(hashRegEx, {
    message: 'Hash must be a valid 64 character long hexadecimal string.',
  })
  hash: string;

  @IsInt()
  block_height: number;

  @IsString()
  @IsNotEmpty()
  @Matches(addressRegEx, {
    message:
      'Sender address must be a valid 40 character long hexadecimal string.',
  })
  sender_address: string;

  success: boolean;

  @IsEnum(['pending', 'completed'])
  status: string;

  isCHZ: boolean;
}
