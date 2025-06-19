import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsDateString,
  IsArray,
  ValidateNested,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderRowDto {
  @ApiProperty()
  @IsUUID()
  product_id: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty()
  @IsUUID()
  user_id: string;

  @ApiProperty({ example: 'Peru' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ example: 'Lima' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ example: 'Lima' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiPropertyOptional({ example: '15001' })
  @IsString()
  @IsOptional()
  postal_code?: string;

  @ApiProperty({ example: 'Av. Javier Prado Este' })
  @IsString()
  @IsNotEmpty()
  line_1: string;

  @ApiPropertyOptional({ example: 'Dpto 202, Torre B' })
  @IsString()
  @IsOptional()
  line_2?: string;

  @ApiProperty({ example: '1234' })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty({ example: '2025-07-01T10:00:00Z' })
  @IsDateString()
  delivery: string;

  @ApiProperty({
    type: [OrderRowDto],
    example: [
      { product_id: 'string', quantity: 2 },
      { product_id: 'string', quantity: 1 },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderRowDto)
  order_rows: OrderRowDto[];
}
