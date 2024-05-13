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
      const filePath = path.resolve(
        __dirname,
        '../..',
        'static',
        'users',
        folder,
        file,
      );
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
      const filePath = path.resolve(
        __dirname,
        '../..',
        'static',
        'users',
        folder,
      );
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

  async createImageFileInCache(file: {
    buffer: string | NodeJS.ArrayBufferView | undefined | null;
  }): Promise<string | null> {
    try {
      if (!file) {
        return null;
      }
      const fileName = uuid.v4() + '.jpg';
      const filePath = path.resolve(__dirname, '../..', 'static', 'cache');
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

  async fromCacheToStatic<T extends string | string[]>(
    fileName: T,
    folder: string,
  ): Promise<T> {
    try {
      if (!fileName || !fileName.length) {
        return;
      }
      if (Array.isArray(fileName)) {
        for (const file of fileName) {
          const res = await this.copyFromCacheToStatic(file, folder);
          if (!res) {
            throw new HttpException(
              errMessages.CREATE_FILE_ERROR,
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }
        }
      } else if (typeof fileName === 'string') {
        const res = await this.copyFromCacheToStatic(fileName, folder);
        if (!res) {
          throw new HttpException(
            errMessages.CREATE_FILE_ERROR,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
      return fileName;
    } catch (e) {
      throw new HttpException(
        errMessages.CREATE_FILE_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async copyFromCacheToStatic(file: string, folder: string) {
    const filePath = path.resolve(__dirname, '../..', 'static', 'cache', file);
    if (fs.existsSync(filePath)) {
      const pathDest = path.resolve(
        __dirname,
        '../..',
        'static',
        'users',
        folder,
      );
      if (!fs.existsSync(pathDest)) {
        fs.mkdirSync(pathDest, { recursive: true });
      }
      await this.copyFile(filePath, path.join(pathDest, file));
      fs.rmSync(filePath, {
        force: true,
      });
      return fs.existsSync(path.join(pathDest, file));
    }
    // fs.rmSync(path.resolve(__dirname, '../..', 'static', 'cache', file));
  }

  private async copyFile(src: string, dest: string) {
    return fs.copyFileSync(src, dest);
  }
}
