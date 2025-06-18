import { IsUUID, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionDto {
  @ApiProperty()
  @IsUUID()
  addressId: string;

  @ApiProperty()
  @IsUUID()
  bundleId: string;

  @ApiProperty()
  @IsUUID()
  paymentMethodId: string;

  @ApiProperty({ example: 15 })
  @IsInt()
  @Min(1)
  @Max(31)
  delivery: number;
}
