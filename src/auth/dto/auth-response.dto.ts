import { ApiProperty } from "@nestjs/swagger";

export class UserResponseDto {
  @ApiProperty({ example: "507f1f77bcf86cd799439011" })
  id: string;

  @ApiProperty({ example: "user@example.com" })
  email: string;

  @ApiProperty({ example: "홍길동" })
  name: string;

  @ApiProperty({ example: "2024-04-23T12:00:00.000Z" })
  createdAt: Date;

  @ApiProperty({ example: 5 })
  grade: number;
}

export class LoginResponseDto {
  @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." })
  access_token: string;

  @ApiProperty()
  user: UserResponseDto;
}

export class RegisterResponseDto extends UserResponseDto {}
