import { IsInt, IsOptional, IsString, Max, Min, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRatingProductDto {
  @ApiProperty()
  @IsUUID()
  user_id: string;

  @ApiProperty()
  @IsUUID()
  product_id: string;

  @ApiProperty({ example: 'This is a comment', required: false })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiProperty({ example: 5, required: false })
  @IsInt()
  @Min(0)
  @Max(5)
  @IsOptional()
  rating?: number;
}
