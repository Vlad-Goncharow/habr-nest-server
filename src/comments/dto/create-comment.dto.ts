import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class CreateCommentDto {
  @ApiProperty({ example: 'example', description: 'Название хаба' })
  @IsString({ message: 'Должно быть строкой' })
  readonly content: string
}
