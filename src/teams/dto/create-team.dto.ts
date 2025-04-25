import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class CreateTeamDto {
  @ApiProperty({ example: "개발팀", description: "팀 이름" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: "서비스 개발을 담당하는 팀입니다.",
    description: "팀 설명",
  })
  @IsString()
  description: string;
}
