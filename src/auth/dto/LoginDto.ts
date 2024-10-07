import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: 'example@gmail.com', description: 'Почта' })
  @IsString()
  readonly email: string;

  @ApiProperty({ example: 'example', description: 'Пароль' })
  @IsString()
  readonly password: string;
}