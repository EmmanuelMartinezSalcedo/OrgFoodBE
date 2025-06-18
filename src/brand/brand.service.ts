import { Injectable, NotFoundException } from '@nestjs/common';
import { Brand } from './entities/brand.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CreateBrandDto } from './dto/create-brand.dto';
import * as path from 'path';
import * as sharp from 'sharp';
import * as fs from 'fs';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ReadBrandDto } from './dto/read-brand.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepo: Repository<Brand>,
    private readonly configService: ConfigService,
  ) {}
  async create(dto: CreateBrandDto) {
    const brand = this.brandRepo.create({
      ...dto,
      image_path: undefined,
    });

    await this.brandRepo.save(brand);

    return { message: 'Brand created successfully' };
  }

  async updateImage(id: string, filename: string) {
    const brand = await this.brandRepo.findOne({ where: { id } });
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    const uploadPath = this.configService.get<string>('UPLOAD_PATH');
    if (!uploadPath) {
      throw new Error(
        'UPLOAD_PATH is not defined in the environment variables',
      );
    }

    const originalRelativePath = `brand/${filename}`;
    const originalFullPath = path.join(uploadPath, originalRelativePath);

    const ext = path.extname(filename).toLowerCase();

    if (ext === '.jpg' || ext === '.jpeg') {
      brand.image_path = originalRelativePath;
      await this.brandRepo.save(brand);
      return { message: 'Image saved without processing' };
    }

    const fileNameWithoutExt = path.parse(filename).name;
    const jpgFilename = `${fileNameWithoutExt}.jpg`;
    const jpgRelativePath = `brand/${jpgFilename}`;
    const jpgFullPath = path.join(uploadPath, jpgRelativePath);

    try {
      await sharp(originalFullPath)
        .jpeg({
          quality: 85,
          progressive: true,
          mozjpeg: true,
        })
        .resize(1200, 1200, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .toFile(jpgFullPath);

      if (originalFullPath !== jpgFullPath && fs.existsSync(originalFullPath)) {
        fs.unlinkSync(originalFullPath);
      }

      if (brand.image_path) {
        const oldFullPath = path.join(uploadPath, brand.image_path);

        if (oldFullPath !== jpgFullPath && fs.existsSync(oldFullPath)) {
          fs.unlinkSync(oldFullPath);
        }
      }

      brand.image_path = jpgRelativePath;
      await this.brandRepo.save(brand);

      return { message: 'Brand image saved successfully' };
    } catch (error) {
      if (fs.existsSync(jpgFullPath)) {
        fs.unlinkSync(jpgFullPath);
      }

      throw new Error(`Failed to process image: ${error.message}`);
    }
  }

  async findOneById(id: string) {
    return this.brandRepo.findOne({ where: { id } });
  }
  async update(id: string, dto: UpdateBrandDto) {
    const brand = await this.findOneById(id);
    if (!brand) {
      return { message: 'Brand not found' };
    }

    Object.assign(brand, dto);
    await this.brandRepo.save(brand);
    return { message: 'Brand updated successfully' };
  }

  async deleteBrand(id: string) {
    const brand = await this.brandRepo.findOne({
      where: { id },
    });

    if (!brand) throw new NotFoundException('Brand not found');

    const uploadPath = this.configService.get<string>('UPLOAD_PATH');
    const imagePath = path.resolve(uploadPath!, 'brand', `${id}.jpg`);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await this.brandRepo.remove(brand);
    return { message: 'Brand deleted successfully' };
  }

  async getAllBrands() {
    return this.brandRepo.find({
      order: { created_date: 'DESC' },
    });
  }

  async getLatestBrands() {
    return this.brandRepo.find({
      order: { created_date: 'DESC' },
      take: 8,
    });
  }

  async getBrandById(id: string) {
    return this.brandRepo.findOne({ where: { id } });
  }

  async findOne(id: string): Promise<ReadBrandDto> {
    const brand = await this.brandRepo.findOne({ where: { id } });
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    return plainToInstance(ReadBrandDto, brand, {
      excludeExtraneousValues: true,
    });
  }

  async getBrandImagePath(id: string): Promise<string> {
    const brand = await this.findOne(id);
    const uploadPath = this.configService.get<string>('UPLOAD_PATH');
    if (!uploadPath) {
      throw new Error(
        'UPLOAD_PATH must be defined in the environment variables',
      );
    }

    let imagePath = path.join(uploadPath, 'brand', 'default.jpg');

    if (brand?.image_path) {
      const brandImagePath = path.join(uploadPath, brand.image_path);
      if (fs.existsSync(brandImagePath)) {
        imagePath = brandImagePath;
      }
    }

    return imagePath;
  }
}
