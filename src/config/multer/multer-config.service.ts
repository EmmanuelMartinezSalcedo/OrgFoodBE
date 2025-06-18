import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { extname, join, resolve } from 'path';
import * as fs from 'fs';

export interface MulterConfigOptions {
  destinationPath: string | ((req: any) => string);
  filenameGenerator?: (req: any, file: Express.Multer.File) => string;
  allowedMimeTypes?: string[];
  fileSizeLimit?: number;
}

@Injectable()
export class MulterConfigService {
  constructor(private readonly configService: ConfigService) {}

  createMulterOptions(options: MulterConfigOptions) {
    return {
      storage: diskStorage({
        destination: (req, file, cb) => {
          try {
            const destPath =
              typeof options.destinationPath === 'function'
                ? options.destinationPath(req)
                : options.destinationPath;

            const basePath = resolve(
              this.configService.get<string>('UPLOAD_PATH')!,
              destPath,
            );

            if (!fs.existsSync(basePath)) {
              fs.mkdirSync(basePath, {
                recursive: true,
                mode: 0o755,
              });
            }

            fs.accessSync(basePath, fs.constants.W_OK);
            cb(null, basePath);
          } catch (error) {
            cb(error, '');
          }
        },
        filename: (req, file, cb) => {
          try {
            const filename = options.filenameGenerator
              ? options.filenameGenerator(req, file)
              : this.defaultFilenameGenerator(req, file);

            cb(null, filename);
          } catch (error) {
            cb(error, '');
          }
        },
      }),

      fileFilter: (
        req: any,
        file: Express.Multer.File,
        callback: (error: Error | null, acceptFile: boolean) => void,
      ) => {
        const allowedTypes = options.allowedMimeTypes || [
          'image/jpeg',
          'image/png',
          'image/jpg',
          'image/gif',
          'image/webp',
        ];

        const isAllowed = allowedTypes.includes(file.mimetype);
        if (!isAllowed) {
          return callback(
            new Error(`Only ${allowedTypes.join(', ')} files are allowed!`),
            false,
          );
        }
        callback(null, true);
      },

      limits: {
        fileSize: options.fileSizeLimit || 10 * 1024 * 1024, // 10MB por defecto
      },
    };
  }

  private defaultFilenameGenerator(
    req: any,
    file: Express.Multer.File,
  ): string {
    const ext = extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    return `${uniqueSuffix}${ext}`;
  }
}
