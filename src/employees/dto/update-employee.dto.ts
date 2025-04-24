import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsNumber,
  IsDate,
  IsOptional,
  Min,
  MaxLength,
} from "class-validator";
import { Type } from "class-transformer";

export class UpdateEmployeeDto {
  @ApiPropertyOptional({ description: "직원 이름" })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: "나이" })
  @IsNumber()
  @Min(1)
  @IsOptional()
  age?: number;

  @ApiPropertyOptional({ description: "연봉" })
  @IsNumber()
  @Min(0)
  @IsOptional()
  salary?: number;

  @ApiPropertyOptional({ description: "입사일" })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  hireDate?: Date;

  @ApiPropertyOptional({ description: "퇴사일" })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  resignDate?: Date;

  @ApiPropertyOptional({ description: "비상연락처" })
  @IsString()
  @IsOptional()
  emergencyContact?: string;

  @ApiPropertyOptional({ description: "집주소" })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ description: "남은 연차" })
  @IsNumber()
  @Min(0)
  @IsOptional()
  remainingLeave?: number;

  @ApiPropertyOptional({ description: "기타 정보" })
  @IsString()
  @MaxLength(500)
  @IsOptional()
  memo?: string;
}
