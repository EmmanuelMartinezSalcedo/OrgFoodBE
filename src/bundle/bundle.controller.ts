import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BundleService } from './bundle.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateBundleDto } from './dto/create-bundle.dto';
import { createMulterInterceptor } from 'src/config/multer/multer.interceptor';
import { extname } from 'path';
import { UpdateImageBundleDto } from './dto/update-image-bundle.dto';
import { UpdateBundleDto } from './dto/update-bundle.dto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Bundles')
@Controller('bundle')
@UseGuards(AuthGuard('jwt'))
export class BundleController {
  constructor(private readonly bundleService: BundleService) {}
  @Post()
  @ApiOperation({ summary: 'Create a bundle' })
  async create(@Body() dto: CreateBundleDto) {
    return this.bundleService.create(dto);
  }

  @Put(':id/image')
  @ApiOperation({ summary: 'Upload or update image of existing bundle by ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateImageBundleDto })
  @UseInterceptors(
    createMulterInterceptor('image', {
      destinationPath: 'bundle',
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

    return this.bundleService.updateImage(id, file.filename);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an bundle by ID' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateBundleDto,
  ) {
    const updated = await this.bundleService.update(id, dto);
    if (!updated) throw new NotFoundException('Bundle not found');
    return updated;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete bundle by ID' })
  async deleteBundle(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.bundleService.deleteBundle(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bundles' })
  async getAll() {
    return this.bundleService.getAllBundles();
  }

  @Get('latest')
  @ApiOperation({ summary: 'Get latest 3 bundles' })
  async getLatest() {
    return this.bundleService.getLatestBundles();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get bundle by ID' })
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    const bundle = await this.bundleService.getBundleById(id);
    if (!bundle) throw new NotFoundException('Bundle not found');
    return bundle;
  }

  @Get(':id/image')
  @ApiOperation({ summary: 'Get the image for a bundle by ID' })
  async findImage(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Res() res: Response,
  ) {
    const imagePath = await this.bundleService.getBundleImagePath(id);
    if (!imagePath) throw new NotFoundException('Image not found');
    return res.sendFile(imagePath, { root: process.cwd() });
  }
}
