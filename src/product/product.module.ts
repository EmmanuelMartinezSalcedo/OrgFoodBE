import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterConfigService } from 'src/config/multer/multer-config.service';
import { Product } from './entities/product.entity';
import { Category } from 'src/category/entities/category.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { Bundle } from 'src/bundle/entities/bundle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, Tag, Bundle])],
  controllers: [ProductController],
  providers: [ProductService, MulterConfigService],
  exports: [ProductService, TypeOrmModule, MulterConfigService],
})
export class ProductModule {}
