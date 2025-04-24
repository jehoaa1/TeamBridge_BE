import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsNumber, IsString, Min } from "class-validator";
import { Type } from "class-transformer";

export class FindEmployeesDto {
  @ApiPropertyOptional({
    description: "페이지 번호",
    default: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    description: "페이지당 항목 수",
    default: 10,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({
    description: "검색어 (이름, 주소)",
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: "최소 연봉",
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  minSalary?: number;

  @ApiPropertyOptional({
    description: "최대 연봉",
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  maxSalary?: number;
}
