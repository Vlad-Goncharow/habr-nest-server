import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class CreateHabDto {
  @ApiProperty({ example: 'example', description: 'Название хаба' })
  @IsString({ message: 'Должно быть строкой' })
  readonly title:string

  @ApiProperty({ example: 'exmaple.jpg', description: 'Картинка хаба' })
  @IsString({ message: 'Должно быть строкой' })
  readonly image:string

  @ApiProperty({ example: 'example', description: 'Описание хаба' })
  @IsString({ message: 'Должно быть строкой' })
  readonly description:string
}
