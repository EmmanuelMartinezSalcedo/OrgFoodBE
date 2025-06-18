import { Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReadProductDto {
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
  discount_percent?: number;

  @ApiProperty()
  @Expose()
  price: number;

  @ApiProperty()
  @Expose()
  unit: string;

  @ApiPropertyOptional()
  @Expose()
  bundle_id?: string;

  @ApiProperty()
  @Expose()
  brand_id: string;
}
