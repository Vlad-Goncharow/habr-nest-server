import { Injectable, BadRequestException } from '@nestjs/common';
import * as sharp from 'sharp';
import * as uuid from 'uuid';
import * as fs from 'fs-extra';
import * as path from 'path';

@Injectable()
export class FilesService {
  private readonly uploadsPath = './uploads';

  constructor() {
    this.ensureDirectoryExists(this.uploadsPath);
  }

  private async ensureDirectoryExists(directory: string): Promise<void> {
    try {
      await fs.ensureDir(directory);
    } catch (err) {
      throw new Error(`Failed to create directory: ${directory}`);
    }
  }

  private validateFileType(file: Express.Multer.File, allowedTypes: string[]): void {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      throw new BadRequestException(`Invalid file type. Allowed types are: ${allowedTypes.join(', ')}`);
    }
  }

  private async checkImageResolution(
    file: Express.Multer.File,
    width?: number,
    height?: number
  ): Promise<void> {
    if (width && height) {
      const metadata = await sharp(file.buffer).metadata();
      if (metadata.width !== width || metadata.height !== height) {
        throw new BadRequestException(`Image must be exactly ${width}x${height} pixels`);
      }
    }
  }

  async uploadAvatar(file: Express.Multer.File): Promise<string> {
    this.validateFileType(file, ['.jpg', '.jpeg', '.png']); 
    await this.checkImageResolution(file, 256, 256); 

    const avatarsDir = path.join(this.uploadsPath, 'avatars');
    await this.ensureDirectoryExists(avatarsDir); 
    const fileName = `${uuid.v4()}.jpg`;

    await sharp(file.buffer).toFile(`${avatarsDir}/${fileName}`);

    return fileName;
  }

  async uploadPublication(file: Express.Multer.File): Promise<string> {
    this.validateFileType(file, ['.jpg', '.jpeg', '.png']); 
    await this.checkImageResolution(file);

    const publicationsDir = path.join(this.uploadsPath, 'publications');
    await this.ensureDirectoryExists(publicationsDir); 

    const fileName = `${uuid.v4()}.jpg`;

    await sharp(file.buffer).toFile(`${publicationsDir}/${fileName}`);

    return fileName;
  }


  async uploadHab(file: Express.Multer.File): Promise<string> {
    this.validateFileType(file, ['.jpg', '.jpeg', '.png']); 
    await this.checkImageResolution(file);

    const publicationsDir = path.join(this.uploadsPath, 'habs');
    await this.ensureDirectoryExists(publicationsDir); 

    const fileName = `${uuid.v4()}.jpg`;

    await sharp(file.buffer).toFile(`${publicationsDir}/${fileName}`);

    return fileName;
  }
}
