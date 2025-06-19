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
import { RatingBundleService } from './rating_bundle.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateRatingBundleDto } from './dto/create-rating_bundle.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Rating bundle')
@Controller('rating-bundle')
@UseGuards(AuthGuard('jwt'))
export class RatingBundleController {
  constructor(private readonly ratingBundleService: RatingBundleService) {}

  @Post()
  @ApiOperation({ summary: 'Create or update rating for a bundle' })
  async rateBundle(@Body() dto: CreateRatingBundleDto) {
    return this.ratingBundleService.createOrUpdate(dto);
  }

  @Get(':bundleId')
  @ApiOperation({ summary: 'Get all comments and ratings for a bundle' })
  async getAllForBundle(@Param('bundleId', ParseUUIDPipe) bundleId: string) {
    return this.ratingBundleService.findAllByBundle(bundleId);
  }

  @Delete(':userId')
  @ApiOperation({ summary: 'Delete all bundle ratings by user' })
  async deleteAllByUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.ratingBundleService.deleteAllByUser(userId);
  }
}
