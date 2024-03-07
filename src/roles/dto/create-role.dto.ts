import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class CreateRoleDto {
  @ApiProperty({ example: 'MODERATOR', description: 'Название роли которую нужно создать' })
  @IsString({ message: 'Должно быть строкой' })
  readonly value: string
  @ApiProperty({ example: 'MODERATOR role', description: 'Описание роли' })
  @IsString({ message: 'Должно быть строкой' })
  readonly description: string
}