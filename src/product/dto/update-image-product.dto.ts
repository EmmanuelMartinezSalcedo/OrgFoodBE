import { ApiProperty } from '@nestjs/swagger';

export class UpdateImageProductDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
}
