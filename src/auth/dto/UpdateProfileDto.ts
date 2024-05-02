import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class UpdateProfileDto {
  @ApiProperty({ example: 'example', description: 'Полное имя' })
  @IsString({ message: 'Должно быть строкой' })
  readonly fullName: string

  @ApiProperty({ example: 'exmaple.jpg', description: 'Описание' })
  @IsString({ message: 'Должно быть строкой' })
  readonly description: string

  @ApiProperty({ example: 'example', description: 'Страна проживания' })
  @IsString({ message: 'Должно быть строкой' })
  readonly country: string

  @ApiProperty({ example: 'example', description: 'Аватар пользователя' })
  @IsString({ message: 'Должно быть строкой' })
  readonly avatar: string

  @ApiProperty({ example: '20/03/2000', description: 'Дата рождения' })
  @IsString({ message: 'Должно быть строкой' })
  readonly dateOfBirth: string
}
