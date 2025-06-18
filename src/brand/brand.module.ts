import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { MulterConfigService } from 'src/config/multer/multer-config.service';

@Module({
  imports: [TypeOrmModule.forFeature([Brand])],
  controllers: [BrandController],
  providers: [BrandService, MulterConfigService],
  exports: [BrandService, TypeOrmModule, MulterConfigService],
})
export class BrandModule {}
