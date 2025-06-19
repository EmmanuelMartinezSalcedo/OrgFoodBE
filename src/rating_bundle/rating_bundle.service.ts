import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RatingBundle } from './entities/rating_bundle.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRatingBundleDto } from './dto/create-rating_bundle.dto';

@Injectable()
export class RatingBundleService {
  constructor(
    @InjectRepository(RatingBundle)
    private readonly ratingRepo: Repository<RatingBundle>,
  ) {}

  async createOrUpdate(dto: CreateRatingBundleDto) {
    const existing = await this.ratingRepo.findOne({
      where: { user_id: dto.user_id, bundle_id: dto.bundle_id },
    });

    if (existing) {
      let updated = false;

      if (dto.comment !== undefined) {
        existing.comment = dto.comment;
        updated = true;
      }

      if (dto.rating !== undefined) {
        existing.rating = dto.rating;
        updated = true;
      }

      if (!updated) {
        throw new BadRequestException('No new comment or rating to update');
      }

      await this.ratingRepo.save(existing);
      return { message: 'Rating updated successfully' };
    }

    if (!dto.comment && dto.rating === undefined) {
      throw new BadRequestException('Either comment or rating is required');
    }

    const newRating = this.ratingRepo.create(dto);
    await this.ratingRepo.save(newRating);
    return { message: 'Rating created successfully' };
  }

  async findAllByBundle(bundleId: string) {
    return this.ratingRepo.find({
      where: { bundle_id: bundleId },
      order: { created_at: 'DESC' },
    });
  }

  async deleteAllByUser(userId: string) {
    const result = await this.ratingRepo.delete({ user_id: userId });
    return {
      message: `Deleted ${result.affected} bundle rating(s) from user ${userId}`,
    };
  }
}
