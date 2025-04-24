import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @ApiProperty({
    example: "user@example.com",
    description: "사용자 이메일",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "password123",
    description: "비밀번호",
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: "홍길동",
    description: "사용자 이름",
  })
  @IsString()
  name: string;
}
