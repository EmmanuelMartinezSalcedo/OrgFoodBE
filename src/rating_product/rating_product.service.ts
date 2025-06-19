import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RatingProduct } from './entities/rating_product.entity';
import { Repository } from 'typeorm';
import { CreateRatingProductDto } from './dto/create-rating_product.dto';

@Injectable()
export class RatingProductService {
  constructor(
    @InjectRepository(RatingProduct)
    private readonly ratingRepo: Repository<RatingProduct>,
  ) {}

  async createOrUpdate(dto: CreateRatingProductDto) {
    const existing = await this.ratingRepo.findOne({
      where: { user_id: dto.user_id, product_id: dto.product_id },
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

  async findAllByProduct(productId: string) {
    return this.ratingRepo.find({
      where: { product_id: productId },
      order: { created_at: 'DESC' },
    });
  }

  async deleteAllByUser(userId: string) {
    const result = await this.ratingRepo.delete({ user_id: userId });
    return {
      message: `Deleted ${result.affected} product rating(s) from user ${userId}`,
    };
  }
}
