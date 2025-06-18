import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Type,
  mixin,
  Injectable,
  OnModuleInit,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  MulterConfigOptions,
  MulterConfigService,
} from './multer-config.service';
import { Observable } from 'rxjs';
import { extname, join } from 'path';
import { ModuleRef } from '@nestjs/core';
import { isUUID } from 'class-validator';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

export function createMulterInterceptor(
  fieldName: string,
  options?: Partial<MulterConfigOptions>,
): Type<NestInterceptor> {
  @Injectable()
  class DynamicMulterInterceptor implements NestInterceptor, OnModuleInit {
    private multerConfigService: MulterConfigService;
    private configService: ConfigService;

    constructor(private readonly moduleRef: ModuleRef) {}

    onModuleInit() {
      this.multerConfigService = this.moduleRef.get(MulterConfigService, {
        strict: false,
      });
      this.configService = this.moduleRef.get(ConfigService, {
        strict: false,
      });
    }

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      if (!this.multerConfigService || !this.configService) {
        throw new Error('Required services not available');
      }

      const request = context.switchToHttp().getRequest();

      if (!isUUID(request.params?.id)) {
        throw new BadRequestException('Invalid UUID in request params');
      }

      const uploadBasePath = this.configService.get<string>('UPLOAD_PATH');

      const defaultOptions: MulterConfigOptions = {
        destinationPath: (req) =>
          join(uploadBasePath!, req.user?.id || 'default'),
        filenameGenerator: (req, file) =>
          `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        fileSizeLimit: 10 * 1024 * 1024,
        ...options,
      };

      const interceptor = new (FileInterceptor(
        fieldName,
        this.multerConfigService.createMulterOptions(defaultOptions),
      ))();

      try {
        return await interceptor.intercept(context, next);
      } catch (error) {
        const file = request.file;
        if (file?.path && fs.existsSync(file.path)) {
          try {
            fs.unlinkSync(file.path);
          } catch {}
        }

        throw error;
      }
    }
  }

  return mixin(DynamicMulterInterceptor);
}
