import {
  IsNotEmpty,
  IsString,
  IsInt,
  Min,
  IsOptional,
  Max,
  IsNumber,
  IsUUID,
  IsPositive,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Product name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'This is a product for OrgFood' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 10 })
  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(75)
  discount_percent?: number;

  @ApiProperty({ example: 29.99 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @ApiProperty({ example: '10 kg' })
  @IsString()
  @IsNotEmpty()
  unit: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  brand_id: string;
}
