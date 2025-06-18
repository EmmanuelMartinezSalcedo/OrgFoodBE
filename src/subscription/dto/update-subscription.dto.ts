import { IsUUID, IsInt, Min, Max, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSubscriptionDto {
  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  addressId?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  paymentMethodId?: string;

  @ApiPropertyOptional({ example: 15 })
  @IsInt()
  @Min(1)
  @Max(31)
  @IsOptional()
  delivery?: number;
}
