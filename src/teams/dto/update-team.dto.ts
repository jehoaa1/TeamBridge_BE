import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";

export class UpdateTeamDto {
  @ApiPropertyOptional({ example: "개발팀", description: "팀 이름" })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: "서비스 개발을 담당하는 팀입니다.",
    description: "팀 설명",
  })
  @IsString()
  @IsOptional()
  description?: string;
}
