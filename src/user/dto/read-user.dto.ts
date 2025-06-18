import { Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from 'src/common/enums/gender.enum';

export class ReadUserDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  lastname: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  gender: Gender;

  @ApiPropertyOptional()
  @Expose()
  birthdate?: string;

  @ApiPropertyOptional()
  @Expose()
  phone_number?: string;

  @ApiPropertyOptional()
  @Expose()
  image_path?: string;

  @ApiProperty()
  @Expose()
  newsletter_subscribed: boolean;
}
