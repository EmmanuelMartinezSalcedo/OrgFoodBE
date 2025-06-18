import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  applyDecorators,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class SetUploadFolderInterceptor implements NestInterceptor {
  constructor(private readonly folder: string) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    req.folder = this.folder;
    return next.handle();
  }
}

export function SetUploadFolder(folder: string) {
  return applyDecorators(
    UseInterceptors(new SetUploadFolderInterceptor(folder)),
  );
}
