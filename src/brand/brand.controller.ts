import {
  Controller,
  Post,
  Body,
  UseGuards,
  Put,
  UseInterceptors,
  Param,
  ParseUUIDPipe,
  UploadedFile,
  NotFoundException,
  Delete,
  Get,
  Res,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { ApiOperation, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { CreateBrandDto } from './dto/create-brand.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateImageBrandDto } from './dto/update-image-brand.dto';
import { createMulterInterceptor } from 'src/config/multer/multer.interceptor';
import { extname } from 'path';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Response } from 'express';

@ApiTags('Brands')
@Controller('brand')
@UseGuards(AuthGuard('jwt'))
export class BrandController {
  constructor(private readonly brandService: BrandService) {}
  @Post()
  @ApiOperation({ summary: 'Create a brand' })
  async create(@Body() dto: CreateBrandDto) {
    return this.brandService.create(dto);
  }

  @Put(':id/image')
  @ApiOperation({ summary: 'Upload or update image of existing brand by ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateImageBrandDto })
  @UseInterceptors(
    createMulterInterceptor('image', {
      destinationPath: 'brand',
      filenameGenerator: (req, file) => {
        const ext = extname(file.originalname);
        return `${req.params.id}${ext}`;
      },
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      fileSizeLimit: 5 * 1024 * 1024,
    }),
  )
  async uploadImage(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new NotFoundException('No image file provided');
    }

    return this.brandService.updateImage(id, file.filename);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an brand by ID' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateBrandDto,
  ) {
    const updated = await this.brandService.update(id, dto);
    if (!updated) throw new NotFoundException('Brand not found');
    return updated;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete brand by ID' })
  async deleteBrand(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.brandService.deleteBrand(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all brands' })
  async getAll() {
    return this.brandService.getAllBrands();
  }

  @Get('latest')
  @ApiOperation({ summary: 'Get latest 8 brands' })
  async getLatest() {
    return this.brandService.getLatestBrands();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get brand by ID' })
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    const brand = await this.brandService.getBrandById(id);
    if (!brand) throw new NotFoundException('Brand not found');
    return brand;
  }

  @Get(':id/image')
  @ApiOperation({ summary: 'Get the image for a brand by ID' })
  async findImage(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Res() res: Response,
  ) {
    const imagePath = await this.brandService.getBrandImagePath(id);
    if (!imagePath) throw new NotFoundException('Image not found');
    return res.sendFile(imagePath, { root: process.cwd() });
  }
}
