import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from 'src/common/enums/gender.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'Alice' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Anderson' })
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({ example: 'alice@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'securePassword_123' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ enum: Gender, example: Gender.FEMALE })
  @IsEnum(Gender)
  gender: Gender;

  @ApiPropertyOptional({ example: '1995-05-20' })
  @IsOptional()
  @IsDateString()
  birthdate?: string;

  @ApiPropertyOptional({
    example: '+14155552671',
  })
  @IsOptional()
  @IsPhoneNumber()
  phone_number?: string;

  @ApiProperty({ example: 'true' })
  @IsBoolean()
  @IsNotEmpty()
  newsletter_subscribed: boolean;
}
