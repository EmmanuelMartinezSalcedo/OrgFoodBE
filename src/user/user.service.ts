import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ReadUserDto } from './dto/read-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { plainToInstance } from 'class-transformer';
import * as path from 'path';
import * as fs from 'fs';
import * as bcrypt from 'bcrypt';
import * as sharp from 'sharp';
import { ConfigService } from '@nestjs/config';
import { Product } from 'src/product/entities/product.entity';
import { Bundle } from 'src/bundle/entities/bundle.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Bundle)
    private readonly bundleRepo: Repository<Bundle>,
    private readonly configService: ConfigService,
  ) {}

  async create(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      ...dto,
      password: hashedPassword,
      image_path: undefined,
    });

    await this.userRepo.save(user);

    return { message: 'User created successfully' };
  }

  async updateImage(id: string, filename: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const uploadPath = this.configService.get<string>('UPLOAD_PATH');
    if (!uploadPath) {
      throw new Error(
        'UPLOAD_PATH is not defined in the environment variables',
      );
    }

    const originalRelativePath = `user/${filename}`;
    const originalFullPath = path.join(uploadPath, originalRelativePath);

    const ext = path.extname(filename).toLowerCase();

    if (ext === '.jpg' || ext === '.jpeg') {
      user.image_path = originalRelativePath;
      await this.userRepo.save(user);
      return { message: 'Image saved without processing' };
    }

    const fileNameWithoutExt = path.parse(filename).name;
    const jpgFilename = `${fileNameWithoutExt}.jpg`;
    const jpgRelativePath = `user/${jpgFilename}`;
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

      if (user.image_path) {
        const oldFullPath = path.join(uploadPath, user.image_path);

        if (oldFullPath !== jpgFullPath && fs.existsSync(oldFullPath)) {
          fs.unlinkSync(oldFullPath);
        }
      }

      user.image_path = jpgRelativePath;
      await this.userRepo.save(user);

      return { message: 'User image saved successfully' };
    } catch (error) {
      if (fs.existsSync(jpgFullPath)) {
        fs.unlinkSync(jpgFullPath);
      }

      throw new Error(`Failed to process image: ${error.message}`);
    }
  }

  async findOne(id: string): Promise<ReadUserDto> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return plainToInstance(ReadUserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async getUserImagePath(id: string): Promise<string> {
    const user = await this.findOne(id);
    const uploadPath = this.configService.get<string>('UPLOAD_PATH');
    if (!uploadPath) {
      throw new Error(
        'UPLOAD_PATH must be defined in the environment variables',
      );
    }

    let imagePath = path.join(uploadPath, 'user', 'default.jpg');

    if (user?.image_path) {
      const userImagePath = path.join(uploadPath, user.image_path);
      if (fs.existsSync(userImagePath)) {
        imagePath = userImagePath;
      }
    }

    return imagePath;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async updateUser(id: string, dto: Partial<UpdateUserDto>) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, dto);
    await this.userRepo.save(user);

    return { message: 'User data updated successfully' };
  }
  async updatePassword(id: string, newPassword: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await this.userRepo.save(user);

    return { message: 'User password updated successfully' };
  }

  async toggleNewsletter(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.newsletter_subscribed = !user.newsletter_subscribed;
    await this.userRepo.save(user);

    return {
      message: user.newsletter_subscribed
        ? 'User subscribed to newsletter'
        : 'User no longer subscribed to newsletter',
    };
  }

  async deleteUser(id: string) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['addresses'],
    });

    if (!user) throw new NotFoundException('User not found');

    const uploadPath = this.configService.get<string>('UPLOAD_PATH');
    const imagePath = path.resolve(uploadPath!, 'user', `${id}.jpg`);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await this.userRepo.remove(user);
    return { message: 'User deleted successfully' };
  }

  async setProductAsFavorite(userId: string, productId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['favoriteProducts'],
    });
    if (!user) throw new NotFoundException('User not found');

    const product = await this.productRepo.findOne({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    const alreadyFavorited = user.favoriteProducts.some(
      (p) => p.id === productId,
    );
    if (!alreadyFavorited) {
      user.favoriteProducts.push(product);
      await this.userRepo.save(user);
    }

    return { message: 'Product marked as favorite' };
  }

  async unsetProductAsFavorite(userId: string, productId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['favoriteProducts'],
    });
    if (!user) throw new NotFoundException('User not found');

    user.favoriteProducts = user.favoriteProducts.filter(
      (p) => p.id !== productId,
    );
    await this.userRepo.save(user);

    return { message: 'Product removed from favorites' };
  }

  async setBundleAsFavorite(userId: string, bundleId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['favoriteBundles'],
    });
    if (!user) throw new NotFoundException('User not found');

    const bundle = await this.bundleRepo.findOne({ where: { id: bundleId } });
    if (!bundle) throw new NotFoundException('Bundle not found');

    const alreadyFavorited = user.favoriteBundles.some(
      (b) => b.id === bundleId,
    );
    if (!alreadyFavorited) {
      user.favoriteBundles.push(bundle);
      await this.userRepo.save(user);
    }

    return { message: 'Bundle marked as favorite' };
  }

  async unsetBundleAsFavorite(userId: string, bundleId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['favoriteBundles'],
    });
    if (!user) throw new NotFoundException('User not found');

    user.favoriteBundles = user.favoriteBundles.filter(
      (b) => b.id !== bundleId,
    );
    await this.userRepo.save(user);

    return { message: 'Bundle removed from favorites' };
  }
}
