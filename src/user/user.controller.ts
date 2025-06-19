import {
  Controller,
  Post,
  Get,
  Put,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  Res,
  NotFoundException,
  ParseUUIDPipe,
  UseGuards,
  Delete,
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiOperation,
  ApiTags,
  ApiOkResponse,
  ApiBody,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';
import { UpdateImageUserDto } from './dto/update-image-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { createMulterInterceptor } from 'src/config/multer/multer.interceptor';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password-user.dto';
import { extname } from 'path';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a user' })
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id/image')
  @ApiOperation({ summary: 'Upload or update image of existing user by ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateImageUserDto })
  @UseInterceptors(
    createMulterInterceptor('image', {
      destinationPath: 'user',
      filenameGenerator: (req, file) => {
        const ext = extname(file.originalname);
        return `${req.params.id}${ext}`;
      },
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      fileSizeLimit: 5 * 1024 * 1024,
    }),
  )
  async uploadImage(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new NotFoundException('No image file provided');
    }

    return this.userService.updateImage(id, file.filename);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiOkResponse({ description: 'User data returned' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const user = await this.userService.findOne(id);
    if (!user) throw new NotFoundException('User not found');

    const { image_path, ...userData } = user;
    return userData;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/image')
  @ApiOperation({ summary: 'Get the image for a user by ID' })
  async findImage(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Res() res: Response,
  ) {
    const imagePath = await this.userService.getUserImagePath(id);
    if (!imagePath) throw new NotFoundException('Image not found');
    return res.sendFile(imagePath, { root: process.cwd() });
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @ApiOperation({ summary: 'Update user data by ID' })
  @ApiBody({ type: UpdateUserDto })
  async updateUser(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateUserDto,
  ) {
    const updated = await this.userService.updateUser(id, dto);
    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id/password')
  @ApiOperation({ summary: 'Update user password by ID' })
  @ApiBody({ type: UpdatePasswordDto })
  async updatePassword(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdatePasswordDto,
  ) {
    return this.userService.updatePassword(id, dto.newPassword);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id/newsletter/toggle')
  @ApiOperation({ summary: 'Toggle newsletter subscription for a user by ID' })
  async toggleNewsletter(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.toggleNewsletter(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  async deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.deleteUser(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':userId/favorite/product/:productId')
  @ApiOperation({ summary: 'Set product as favorite for a user' })
  async setProductAsFavorite(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    return this.userService.setProductAsFavorite(userId, productId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':userId/favorite/product/:productId')
  @ApiOperation({ summary: 'Unset product as favorite for a user' })
  async unsetProductAsFavorite(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    return this.userService.unsetProductAsFavorite(userId, productId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':userId/favorite/bundle/:bundleId')
  @ApiOperation({ summary: 'Set bundle as favorite for a user' })
  async setBundleAsFavorite(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('bundleId', ParseUUIDPipe) bundleId: string,
  ) {
    return this.userService.setBundleAsFavorite(userId, bundleId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':userId/favorite/bundle/:bundleId')
  @ApiOperation({ summary: 'Unset bundle as favorite for a user' })
  async unsetBundleAsFavorite(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('bundleId', ParseUUIDPipe) bundleId: string,
  ) {
    return this.userService.unsetBundleAsFavorite(userId, bundleId);
  }
}
