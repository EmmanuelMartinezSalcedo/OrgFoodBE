import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bundle } from './entities/bundle.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CreateBundleDto } from './dto/create-bundle.dto';
import * as path from 'path';
import * as sharp from 'sharp';
import * as fs from 'fs';
import { UpdateBundleDto } from './dto/update-bundle.dto';
import { plainToInstance } from 'class-transformer';
import { ReadBundleDto } from './dto/read-bundle.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class BundleService {
  constructor(
    @InjectRepository(Bundle)
    private readonly bundleRepo: Repository<Bundle>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly configService: ConfigService,
  ) {}
  async create(dto: CreateBundleDto) {
    const { user_id, ...bundleData } = dto;

    let users: User[] = [];

    if (user_id) {
      const user = await this.userRepo.findOne({
        where: { id: user_id },
        relations: ['bundles'],
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${user_id} not found`);
      }

      if (user.bundles.length >= 3) {
        throw new BadRequestException('User cannot create more than 3 bundles');
      }

      users = [user];
    }

    const bundle = this.bundleRepo.create({
      ...bundleData,
      users,
      image_path: undefined,
    });

    await this.bundleRepo.save(bundle);

    return { message: 'Bundle created successfully' };
  }

  async updateImage(id: string, filename: string) {
    const bundle = await this.bundleRepo.findOne({ where: { id } });
    if (!bundle) {
      throw new NotFoundException('Bundle not found');
    }

    const uploadPath = this.configService.get<string>('UPLOAD_PATH');
    if (!uploadPath) {
      throw new Error(
        'UPLOAD_PATH is not defined in the environment variables',
      );
    }

    const originalRelativePath = `bundle/${filename}`;
    const originalFullPath = path.join(uploadPath, originalRelativePath);

    const ext = path.extname(filename).toLowerCase();

    if (ext === '.jpg' || ext === '.jpeg') {
      bundle.image_path = originalRelativePath;
      await this.bundleRepo.save(bundle);
      return { message: 'Image saved without processing' };
    }

    const fileNameWithoutExt = path.parse(filename).name;
    const jpgFilename = `${fileNameWithoutExt}.jpg`;
    const jpgRelativePath = `bundle/${jpgFilename}`;
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

      if (bundle.image_path) {
        const oldFullPath = path.join(uploadPath, bundle.image_path);

        if (oldFullPath !== jpgFullPath && fs.existsSync(oldFullPath)) {
          fs.unlinkSync(oldFullPath);
        }
      }

      bundle.image_path = jpgRelativePath;
      await this.bundleRepo.save(bundle);

      return { message: 'Bundle image saved successfully' };
    } catch (error) {
      if (fs.existsSync(jpgFullPath)) {
        fs.unlinkSync(jpgFullPath);
      }

      throw new Error(`Failed to process image: ${error.message}`);
    }
  }

  async findOneById(id: string) {
    return this.bundleRepo.findOne({ where: { id } });
  }
  async update(id: string, dto: UpdateBundleDto) {
    const bundle = await this.findOneById(id);
    if (!bundle) {
      return { message: 'Bundle not found' };
    }

    Object.assign(bundle, dto);
    await this.bundleRepo.save(bundle);
    return { message: 'Bundle updated successfully' };
  }

  async deleteBundle(id: string) {
    const bundle = await this.bundleRepo.findOne({
      where: { id },
    });

    if (!bundle) throw new NotFoundException('Bundle not found');

    const uploadPath = this.configService.get<string>('UPLOAD_PATH');
    const imagePath = path.resolve(uploadPath!, 'bundle', `${id}.jpg`);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await this.bundleRepo.remove(bundle);
    return { message: 'Bundle deleted successfully' };
  }

  async getAllBundles() {
    return this.bundleRepo
      .createQueryBuilder('bundle')
      .leftJoin('bundle.users', 'user')
      .where('user.id IS NULL')
      .orderBy('bundle.created_date', 'DESC')
      .getMany();
  }

  async getLatestBundles() {
    return this.bundleRepo.find({
      order: { created_date: 'DESC' },
      take: 3,
    });
  }

  async getBundleById(id: string) {
    return this.bundleRepo.findOne({ where: { id } });
  }

  async findOne(id: string): Promise<ReadBundleDto> {
    const bundle = await this.bundleRepo.findOne({ where: { id } });
    if (!bundle) {
      throw new NotFoundException('Bundle not found');
    }

    return plainToInstance(ReadBundleDto, bundle, {
      excludeExtraneousValues: true,
    });
  }

  async getBundleImagePath(id: string): Promise<string> {
    const bundle = await this.findOne(id);
    const uploadPath = this.configService.get<string>('UPLOAD_PATH');
    if (!uploadPath) {
      throw new Error(
        'UPLOAD_PATH must be defined in the environment variables',
      );
    }

    let imagePath = path.join(uploadPath, 'bundle', 'default.jpg');

    if (bundle?.image_path) {
      const bundleImagePath = path.join(uploadPath, bundle.image_path);
      if (fs.existsSync(bundleImagePath)) {
        imagePath = bundleImagePath;
      }
    }

    return imagePath;
  }
}
