import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsNumber,
  IsDate,
  IsOptional,
  Min,
  MaxLength,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateEmployeeDto {
  @ApiProperty({ description: "직원 이름" })
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({ description: "나이" })
  @IsNumber()
  @Min(1)
  age: number;

  @ApiProperty({ description: "연봉" })
  @IsNumber()
  @Min(0)
  salary: number;

  @ApiProperty({ description: "입사일" })
  @Type(() => Date)
  @IsDate()
  hireDate: Date;

  @ApiPropertyOptional({ description: "퇴사일" })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  resignDate?: Date;

  @ApiProperty({ description: "비상연락처" })
  @IsString()
  emergencyContact: string;

  @ApiProperty({ description: "집주소" })
  @IsString()
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
}
