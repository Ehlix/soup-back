import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { errMessages } from 'src/common/constants/errMessages';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';

@Injectable()
export class FilesService {
  async deleteFile(file: string, folder: string) {
    try {
      if (!file) {
        return;
      }
      const filePath = path.resolve(__dirname, '..', 'static', folder, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (e) {
      throw new HttpException(
        errMessages.CREATE_FILE_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createImageFile(
    file: {
      buffer: string | NodeJS.ArrayBufferView | undefined | null;
    },
    folder: string,
  ): Promise<string | null> {
    try {
      if (!file) {
        return null;
      }
      const fileName = uuid.v4() + '.jpg';
      const filePath = path.resolve(__dirname, '..', 'static', folder);
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(path.join(filePath, fileName), file.buffer);
      return fileName;
    } catch (e) {
      throw new HttpException(
        errMessages.CREATE_FILE_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
