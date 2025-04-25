import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsNumber,
  IsDate,
  IsOptional,
  Min,
  MaxLength,
  IsNotEmpty,
  IsMongoId,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateEmployeeDto {
  @ApiProperty({ example: "홍길동", description: "직원 이름" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiProperty({ example: 30, description: "나이" })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  age: number;

  @ApiProperty({ example: 50000000, description: "연봉" })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  salary: number;

  @ApiProperty({ example: "2024-01-01", description: "입사일" })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  hireDate: Date;

  @ApiPropertyOptional({ description: "퇴사일" })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  resignDate?: Date;

  @ApiProperty({ example: "010-1234-5678", description: "비상 연락처" })
  @IsString()
  @IsOptional()
  emergencyContact: string;

  @ApiProperty({ example: "서울시 강남구", description: "주소" })
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty({ description: "남은 연차", default: 15 })
  @IsNumber()
  @Min(0)
  remainingLeave: number;

  @ApiPropertyOptional({ description: "기타 정보" })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  memo?: string;

  @ApiProperty({
    example: "507f1f77bcf86cd799439011",
    description: "소속 팀 ID",
    required: true,
  })
  @IsMongoId()
  @IsNotEmpty()
  teamId: string;
}
