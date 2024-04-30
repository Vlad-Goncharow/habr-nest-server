import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";
import { diskStorage } from "multer";
import * as uuid from 'uuid'

@ApiTags('Работа с файлами')
@Controller('files')

export class FilesController{


  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: "./uploads",
      filename: (req, file, cb) => {
        const fileName = uuid.v4() + '.jpg'
        cb(null, fileName)
      }
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(null, false)
      }
      cb(null, true)
    }
  }))
  uploadPhoto(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return {
        success:false
      }
    } else {
      return {
        filename: file.filename
      }
    }
  }
}