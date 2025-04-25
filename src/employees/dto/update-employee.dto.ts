import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsNumber,
  IsDate,
  IsOptional,
  Min,
  MaxLength,
  IsMongoId,
} from "class-validator";
import { Type } from "class-transformer";

export class UpdateEmployeeDto {
  @ApiPropertyOptional({ example: "홍길동", description: "직원 이름" })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  name?: string;

  @ApiPropertyOptional({ example: 30, description: "나이" })
  @IsNumber()
  @IsOptional()
  @Min(1)
  age?: number;

  @ApiPropertyOptional({ example: 50000000, description: "연봉" })
  @IsNumber()
  @IsOptional()
  @Min(0)
  salary?: number;

  @ApiPropertyOptional({ example: "2024-01-01", description: "입사일" })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  hireDate?: Date;

  @ApiPropertyOptional({ description: "퇴사일" })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  resignDate?: Date;

  @ApiPropertyOptional({ example: "010-1234-5678", description: "비상 연락처" })
  @IsString()
  @IsOptional()
  emergencyContact?: string;

  @ApiPropertyOptional({ example: "서울시 강남구", description: "주소" })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ description: "남은 연차" })
  @IsNumber()
  @IsOptional()
  @Min(0)
  remainingLeave?: number;

  @ApiPropertyOptional({ description: "기타 정보" })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  memo?: string;

  @ApiPropertyOptional({
    example: "507f1f77bcf86cd799439011",
    description: "소속 팀 ID",
  })
  @IsMongoId()
  @IsOptional()
  teamId?: string;
}
