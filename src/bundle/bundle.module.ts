import { Module } from '@nestjs/common';
import { BundleController } from './bundle.controller';
import { BundleService } from './bundle.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterConfigService } from 'src/config/multer/multer-config.service';
import { Bundle } from './entities/bundle.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bundle, User])],
  controllers: [BundleController],
  providers: [BundleService, MulterConfigService],
  exports: [BundleService, TypeOrmModule, MulterConfigService],
})
export class BundleModule {}
