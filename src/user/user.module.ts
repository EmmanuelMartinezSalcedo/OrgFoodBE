import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MulterConfigService } from 'src/config/multer/multer-config.service';
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, MulterConfigService],
  exports: [UserService, TypeOrmModule, MulterConfigService],
})
export class UserModule {}
