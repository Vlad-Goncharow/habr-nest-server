import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class CreatePostDto {
  @ApiProperty({ example: 'example', description: 'Название поста' })
  @IsString({ message: 'Должно быть строкой' })
  readonly title: string

  @ApiProperty({ example: 'exmaple.jpg', description: 'Картинка поста' })
  @IsString({ message: 'Должно быть строкой' })
  readonly image: string

  @ApiProperty({ example: 'example', description: 'Текст поста' })
  @IsString({ message: 'Должно быть строкой' })
  readonly content: string

  @ApiProperty({ example: 'example', description: 'id пользователя' })
  @IsString({ message: 'Должно быть строкой' })
  readonly userId: string

  @ApiProperty({ example: 'develop', description: 'Категории поста' })
  @IsString({ message: 'Должно быть строкой' })
  readonly category: string

  @ApiProperty({ example: 'develop', description: 'Тип поста' })
  @IsString({ message: 'Должно быть строкой' })
  readonly type: string

  @ApiProperty({ example: 'example', description: 'Текст поста' })
  readonly habs: number[]
}
