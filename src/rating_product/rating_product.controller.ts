import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RatingProductService } from './rating_product.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateRatingProductDto } from './dto/create-rating_product.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Rating product')
@Controller('rating-product')
@UseGuards(AuthGuard('jwt'))
export class RatingProductController {
  constructor(private readonly ratingProductService: RatingProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create or update rating for a product' })
  async rateProduct(@Body() dto: CreateRatingProductDto) {
    return this.ratingProductService.createOrUpdate(dto);
  }

  @Get(':productId')
  @ApiOperation({ summary: 'Get all comments and ratings for a product' })
  async getAllForProduct(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.ratingProductService.findAllByProduct(productId);
  }

  @Delete(':userId')
  @ApiOperation({ summary: 'Delete all product ratings by user' })
  async deleteAllByUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.ratingProductService.deleteAllByUser(userId);
  }
}
