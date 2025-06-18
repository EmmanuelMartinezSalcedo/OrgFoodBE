import { ApiProperty } from '@nestjs/swagger';

export class UpdateImageBundleDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
}
