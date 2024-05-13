import {
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(AccessTokenGuard)
  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Req() req: Request,
    @UploadedFile() data: Express.Multer.File,
  ): Promise<{ file: string }> {
    const file = await this.filesService.createImageFileInCache(data);
    return { file };
  }
}
