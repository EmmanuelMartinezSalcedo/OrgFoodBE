import { Module } from '@nestjs/common';
import { RatingBundleController } from './rating_bundle.controller';
import { RatingBundleService } from './rating_bundle.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingBundle } from './entities/rating_bundle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RatingBundle])],
  controllers: [RatingBundleController],
  providers: [RatingBundleService],
  exports: [RatingBundleService],
})
export class RatingBundleModule {}
