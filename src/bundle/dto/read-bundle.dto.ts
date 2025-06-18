import { Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReadBundleDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiPropertyOptional()
  @Expose()
  description?: string;

  @ApiPropertyOptional()
  @Expose()
  image_path?: string;

  @ApiPropertyOptional()
  @Expose()
  created_date: Date;

  @ApiPropertyOptional()
  @Expose()
  discount_percent: number;
}
