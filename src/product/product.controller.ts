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
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { createMulterInterceptor } from 'src/config/multer/multer.interceptor';
import { extname } from 'path';
import { UpdateImageProductDto } from './dto/update-image-product.dto';
import { UpdateProductDto } from 'src/product/dto/update-product.dto';
import { Response } from 'express';

@ApiTags('Products')
@Controller('product')
@UseGuards(AuthGuard('jwt'))
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post()
  @ApiOperation({ summary: 'Create a product' })
  async create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Put(':id/image')
  @ApiOperation({ summary: 'Upload or update image of existing product by ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateImageProductDto })
  @UseInterceptors(
    createMulterInterceptor('image', {
      destinationPath: 'product',
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

    return this.productService.updateImage(id, file.filename);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an product by ID' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateProductDto,
  ) {
    const updated = await this.productService.update(id, dto);
    if (!updated) throw new NotFoundException('Product not found');
    return updated;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product by ID' })
  async deleteProduct(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.productService.deleteProduct(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  async getAll() {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    const product = await this.productService.getProductById(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  @Get(':id/image')
  @ApiOperation({ summary: 'Get the image for a product by ID' })
  async findImage(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Res() res: Response,
  ) {
    const imagePath = await this.productService.getProductImagePath(id);
    if (!imagePath) throw new NotFoundException('Image not found');
    return res.sendFile(imagePath, { root: process.cwd() });
  }

  @Put(':id/category/:categoryId')
  @ApiOperation({ summary: 'Add product to category' })
  async addToCategory(
    @Param('id', new ParseUUIDPipe()) productId: string,
    @Param('categoryId', new ParseUUIDPipe()) categoryId: string,
  ) {
    return this.productService.addToCategory(productId, categoryId);
  }

  @Delete(':id/category/:categoryId')
  @ApiOperation({ summary: 'Remove category from product' })
  async removeFromCategory(
    @Param('id', new ParseUUIDPipe()) productId: string,
    @Param('categoryId', new ParseUUIDPipe()) categoryId: string,
  ) {
    return this.productService.removeFromCategory(productId, categoryId);
  }

  @Put(':id/tag/:tagId')
  @ApiOperation({ summary: 'Add product to tag' })
  async addToTag(
    @Param('id', new ParseUUIDPipe()) productId: string,
    @Param('tagId', new ParseUUIDPipe()) tagId: string,
  ) {
    return this.productService.addToTag(productId, tagId);
  }

  @Delete(':id/tag/:tagId')
  @ApiOperation({ summary: 'Remove tag from product' })
  async removeFromTag(
    @Param('id', new ParseUUIDPipe()) productId: string,
    @Param('tagId', new ParseUUIDPipe()) tagId: string,
  ) {
    return this.productService.removeFromTag(productId, tagId);
  }

  @Put(':id/bundle/:bundleId')
  @ApiOperation({ summary: 'Add product to bundle' })
  async addToBundle(
    @Param('id', new ParseUUIDPipe()) productId: string,
    @Param('bundleId', new ParseUUIDPipe()) bundleId: string,
  ) {
    return this.productService.addToBundle(productId, bundleId);
  }

  @Delete(':id/bundle')
  @ApiOperation({ summary: 'Remove product from bundle' })
  async removeFromBundle(@Param('id', new ParseUUIDPipe()) productId: string) {
    return this.productService.removeFromBundle(productId);
  }
}
