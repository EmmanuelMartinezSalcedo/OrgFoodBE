import { Module } from '@nestjs/common';
import { SocialService } from './social.service';
import { SocialController } from './social.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Social } from './entities/social.entity';
import { MulterConfigService } from 'src/config/multer/multer-config.service';
import { BrandModule } from 'src/brand/brand.module';

@Module({
  imports: [TypeOrmModule.forFeature([Social]), BrandModule],
  controllers: [SocialController],
  providers: [SocialService, MulterConfigService],
  exports: [SocialService, TypeOrmModule, MulterConfigService],
})
export class SocialModule {}
