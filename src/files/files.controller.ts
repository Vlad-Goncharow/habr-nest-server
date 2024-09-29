import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { FilesService } from "./files.service";
import * as fs from 'fs-extra'
import { diskStorage } from "multer";

@ApiTags('Работа с файлами')
@Controller('files')

export class FilesController {
  constructor(private readonly fileService: FilesService) {}
  
  @Post('upload')
  @ApiOperation({ summary: "Загрузка картинки публикаций" })
  @UseInterceptors(FileInterceptor('publication', {
    limits: { fileSize: 4 * 1024 * 1024 }, 
  }))
  async uploadPublication(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    
    const fileName = await this.fileService.uploadPublication(file);
    return { filename: fileName };
  }

  @ApiOperation({ summary: "Загрузка картинки аватарок" })
  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('avatar', {
    limits: { fileSize: 2 * 1024 * 1024 }, 
  }))
  async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    
    const fileName = await this.fileService.uploadAvatar(file);
    return { filename: fileName };
  }


  @ApiOperation({ summary: "Загрузка картинки хаба" })
  @Post('upload-hab')
  @UseInterceptors(FileInterceptor('hab', {
    limits: { fileSize: 2 * 1024 * 1024 }, 
  }))
  async uploadHab(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    
    const fileName = await this.fileService.uploadHab(file);
    return { filename: fileName };
  }
}
