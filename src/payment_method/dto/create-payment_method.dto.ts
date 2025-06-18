import { IsNotEmpty, IsNumber, IsString, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentMethodDto {
  @ApiProperty({ example: 'Alicia Anderson' })
  @IsString()
  @IsNotEmpty()
  card_holder_name: string;

  @ApiProperty({ example: 'Visa' })
  @IsString()
  @IsNotEmpty()
  card_brand: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(12)
  exp_month: number;

  @ApiProperty({ example: 26 })
  @IsNumber()
  @IsNotEmpty()
  @Min(26)
  @Max(99)
  exp_year: number;

  @ApiProperty({ example: '1234' })
  @IsString()
  @IsNotEmpty()
  card_last4: string;
}
