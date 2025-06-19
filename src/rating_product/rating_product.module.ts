import { Module } from '@nestjs/common';
import { RatingProductService } from './rating_product.service';
import { RatingProductController } from './rating_product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingProduct } from './entities/rating_product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RatingProduct])],
  controllers: [RatingProductController],
  providers: [RatingProductService],
  exports: [RatingProductService],
})
export class RatingProductModule {}
