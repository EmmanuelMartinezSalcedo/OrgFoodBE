import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CreateProductDto } from './dto/create-product.dto';
import * as path from 'path';
import * as sharp from 'sharp';
import * as fs from 'fs';
import { UpdateProductDto } from './dto/update-product.dto';
import { plainToInstance } from 'class-transformer';
import { ReadProductDto } from './dto/read-product.dto';
import { Category } from 'src/category/entities/category.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { Bundle } from 'src/bundle/entities/bundle.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,

    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,

    @InjectRepository(Bundle)
    private readonly bundleRepo: Repository<Bundle>,
    private readonly configService: ConfigService,
  ) {}
  async create(dto: CreateProductDto) {
    const product = this.productRepo.create({
      ...dto,
      image_path: undefined,
    });

    await this.productRepo.save(product);

    return { message: 'Product created successfully' };
  }

  async updateImage(id: string, filename: string) {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const uploadPath = this.configService.get<string>('UPLOAD_PATH');
    if (!uploadPath) {
      throw new Error(
        'UPLOAD_PATH is not defined in the environment variables',
      );
    }

    const originalRelativePath = `product/${filename}`;
    const originalFullPath = path.join(uploadPath, originalRelativePath);

    const ext = path.extname(filename).toLowerCase();

    if (ext === '.jpg' || ext === '.jpeg') {
      product.image_path = originalRelativePath;
      await this.productRepo.save(product);
      return { message: 'Image saved without processing' };
    }

    const fileNameWithoutExt = path.parse(filename).name;
    const jpgFilename = `${fileNameWithoutExt}.jpg`;
    const jpgRelativePath = `product/${jpgFilename}`;
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

      if (product.image_path) {
        const oldFullPath = path.join(uploadPath, product.image_path);

        if (oldFullPath !== jpgFullPath && fs.existsSync(oldFullPath)) {
          fs.unlinkSync(oldFullPath);
        }
      }

      product.image_path = jpgRelativePath;
      await this.productRepo.save(product);

      return { message: 'Product image saved successfully' };
    } catch (error) {
      if (fs.existsSync(jpgFullPath)) {
        fs.unlinkSync(jpgFullPath);
      }

      throw new Error(`Failed to process image: ${error.message}`);
    }
  }

  async findOneById(id: string) {
    return this.productRepo.findOne({ where: { id } });
  }
  async update(id: string, dto: UpdateProductDto) {
    const product = await this.findOneById(id);
    if (!product) {
      return { message: 'Product not found' };
    }

    Object.assign(product, dto);
    await this.productRepo.save(product);
    return { message: 'Product updated successfully' };
  }

  async deleteProduct(id: string) {
    const product = await this.productRepo.findOne({
      where: { id },
    });

    if (!product) throw new NotFoundException('Product not found');

    const uploadPath = this.configService.get<string>('UPLOAD_PATH');
    const imagePath = path.resolve(uploadPath!, 'product', `${id}.jpg`);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await this.productRepo.remove(product);
    return { message: 'Product deleted successfully' };
  }

  async getAllProducts() {
    return this.productRepo.find({
      order: { created_date: 'DESC' },
    });
  }

  async getProductById(id: string) {
    return this.productRepo.findOne({ where: { id } });
  }

  async findOne(id: string): Promise<ReadProductDto> {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return plainToInstance(ReadProductDto, product, {
      excludeExtraneousValues: true,
    });
  }

  async getProductImagePath(id: string): Promise<string> {
    const product = await this.findOne(id);
    const uploadPath = this.configService.get<string>('UPLOAD_PATH');
    if (!uploadPath) {
      throw new Error(
        'UPLOAD_PATH must be defined in the environment variables',
      );
    }

    let imagePath = path.join(uploadPath, 'product', 'default.jpg');

    if (product?.image_path) {
      const productImagePath = path.join(uploadPath, product.image_path);
      if (fs.existsSync(productImagePath)) {
        imagePath = productImagePath;
      }
    }

    return imagePath;
  }

  async addToCategory(productId: string, categoryId: string) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
      relations: ['categories'],
    });
    if (!product) throw new NotFoundException('Product not found');

    const category = await this.categoryRepo.findOne({
      where: { id: categoryId },
    });
    if (!category) throw new NotFoundException('Category not found');

    product.categories = [...(product.categories || []), category];
    await this.productRepo.save(product);
    return { message: 'Product added to category successfully' };
  }

  async removeFromCategory(productId: string, categoryId: string) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
      relations: ['categories'],
    });
    if (!product) throw new NotFoundException('Product not found');

    const category = await this.categoryRepo.findOne({
      where: { id: categoryId },
    });
    if (!category) throw new NotFoundException('Category not found');

    product.categories = (product.categories || []).filter(
      (cat) => cat.id !== category.id,
    );
    await this.productRepo.save(product);

    return { message: 'Category removed from product successfully' };
  }

  async addToTag(productId: string, tagId: string) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
      relations: ['tags'],
    });
    if (!product) throw new NotFoundException('Product not found');

    const tag = await this.tagRepo.findOne({
      where: { id: tagId },
    });
    if (!tag) throw new NotFoundException('Tag not found');

    product.tags = [...(product.tags || []), tag];
    await this.productRepo.save(product);
    return { message: 'Product added to tag successfully' };
  }

  async removeFromTag(productId: string, tagId: string) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
      relations: ['tags'],
    });
    if (!product) throw new NotFoundException('Product not found');

    const tag = await this.tagRepo.findOne({
      where: { id: tagId },
    });
    if (!tag) throw new NotFoundException('Tag not found');

    product.tags = (product.tags || []).filter((cat) => cat.id !== tag.id);
    await this.productRepo.save(product);

    return { message: 'Tag removed from product successfully' };
  }

  async addToBundle(productId: string, bundleId: string) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    const bundle = await this.bundleRepo.findOne({ where: { id: bundleId } });
    if (!bundle) throw new NotFoundException('Bundle not found');

    product.bundle = bundle;
    product.bundle_id = bundle.id;

    await this.productRepo.save(product);

    return { message: 'Product added to bundle successfully' };
  }

  async removeFromBundle(productId: string) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    product.bundle = null;
    product.bundle_id = null;

    await this.productRepo.save(product);

    return { message: 'Product removed from bundle successfully' };
  }
}
