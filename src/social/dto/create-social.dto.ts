import { IsNotEmpty, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSocialDto {
  @ApiProperty({ example: 'https://www.instagram.com/brand_name' })
  @IsUrl()
  @IsNotEmpty()
  link: string;
}
