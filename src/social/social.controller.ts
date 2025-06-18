import {
  Controller,
  Post,
  Param,
  Body,
  ParseUUIDPipe,
  Get,
  NotFoundException,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SocialService } from './social.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateSocialDto } from './dto/create-social.dto';
import { UpdateSocialDto } from './dto/update-social.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Socials')
@Controller('social')
@UseGuards(AuthGuard('jwt'))
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @Post(':brandId')
  @ApiOperation({ summary: 'Add social to brand by brandID' })
  create(
    @Param('brandId', new ParseUUIDPipe()) brandId: string,
    @Body() dto: CreateSocialDto,
  ) {
    return this.socialService.createSocial(brandId, dto);
  }

  @Get('all/:brandId')
  @ApiOperation({ summary: 'Get all socials for a brand by brandID' })
  async findAllByBrand(@Param('brandId', new ParseUUIDPipe()) brandId: string) {
    const sociales = await this.socialService.findAllByBrand(brandId);
    if (!sociales || sociales.length === 0) {
      throw new NotFoundException('No sociales found for this brand');
    }
    return sociales;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a social by ID' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateSocialDto,
  ) {
    const updated = await this.socialService.update(id, dto);
    if (!updated) throw new NotFoundException('Social not found');
    return updated;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an social by ID' })
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    const deleted = await this.socialService.delete(id);
    if (!deleted) throw new NotFoundException('Social not found');
    return { message: 'Social deleted successfully' };
  }
}
