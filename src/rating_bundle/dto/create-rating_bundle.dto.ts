import { IsInt, IsOptional, IsString, Max, Min, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRatingBundleDto {
  @ApiProperty()
  @IsUUID()
  user_id: string;

  @ApiProperty()
  @IsUUID()
  bundle_id: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(0)
  @Max(5)
  @IsOptional()
  rating?: number;
}
