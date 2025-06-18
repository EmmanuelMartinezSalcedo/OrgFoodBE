import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty({ example: 'Peru' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ example: 'Lima' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ example: 'Miraflores' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiPropertyOptional({ example: '15074' })
  @IsOptional()
  @IsString()
  postal_code?: string;

  @ApiProperty({ example: 'Av. Larco' })
  @IsString()
  @IsNotEmpty()
  line_1: string;

  @ApiPropertyOptional({ example: 'Apt 302' })
  @IsOptional()
  @IsString()
  line_2?: string;

  @ApiProperty({ example: 123 })
  @IsInt()
  @IsNotEmpty()
  number: number;
}
