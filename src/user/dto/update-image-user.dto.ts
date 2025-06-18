import { ApiProperty } from '@nestjs/swagger';

export class UpdateImageUserDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
}
