import { Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReadBrandDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiPropertyOptional()
  @Expose()
  image_path?: string;

  @ApiPropertyOptional()
  @Expose()
  created_date: Date;
}
