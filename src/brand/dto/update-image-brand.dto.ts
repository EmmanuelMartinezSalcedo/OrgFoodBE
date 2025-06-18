import { ApiProperty } from '@nestjs/swagger';

export class UpdateImageBrandDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
}
