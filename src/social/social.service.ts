import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Social } from './entities/social.entity';
import { Brand } from 'src/brand/entities/brand.entity';
import { Repository } from 'typeorm';
import { CreateSocialDto } from './dto/create-social.dto';
import { UpdateSocialDto } from './dto/update-social.dto';

@Injectable()
export class SocialService {
  constructor(
    @InjectRepository(Social)
    private readonly socialRepo: Repository<Social>,
    @InjectRepository(Brand)
    private readonly brandRepo: Repository<Brand>,
  ) {}

  async createSocial(brandId: string, dto: CreateSocialDto) {
    const brand = await this.brandRepo.findOne({ where: { id: brandId } });
    if (!brand) throw new NotFoundException('Brand not found');

    const existingSocials = await this.socialRepo.count({
      where: { brand_id: brandId },
    });

    if (existingSocials >= 4) {
      throw new BadRequestException(
        'Brand cannot have more than 4 social links',
      );
    }

    const social = this.socialRepo.create({ ...dto, brand_id: brandId });
    await this.socialRepo.save(social);

    return { message: 'Social created successfully' };
  }

  async findAllByBrand(brandId: string) {
    const brand = await this.brandRepo.findOne({
      where: { id: brandId },
      relations: ['socials'],
    });

    if (!brand) throw new NotFoundException('Brand not found');
    return brand.socials;
  }

  async findOneById(id: string) {
    return this.socialRepo.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateSocialDto) {
    const social = await this.findOneById(id);
    if (!social) {
      return { message: 'Social not found' };
    }

    Object.assign(social, dto);
    await this.socialRepo.save(social);
    return { message: 'Social updated successfully' };
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.socialRepo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
