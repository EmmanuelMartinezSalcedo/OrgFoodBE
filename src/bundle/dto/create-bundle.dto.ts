import {
  IsNotEmpty,
  IsString,
  IsInt,
  Min,
  IsOptional,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBundleDto {
  @ApiProperty({ example: 'Bundle name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'This is a bundle for OrgFood' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 10 })
  @IsInt()
  @IsNotEmpty()
  @Min(5)
  @Max(20)
  discount_percent: number;
}
