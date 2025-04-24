import { ApiProperty } from "@nestjs/swagger";
import { Employee } from "../schemas/employee.schema";

// 실제 데이터 DTO
export class EmployeesData {
  @ApiProperty({ type: [Employee] })
  items: Employee[];

  @ApiProperty({ description: "전체 직원 수" })
  totalCount: number;
}

// API 응답 래퍼 DTO
export class EmployeesResponseDto {
  @ApiProperty({ type: [Employee] })
  items: Employee[];

  @ApiProperty({ description: "전체 직원 수" })
  totalCount: number;
}
