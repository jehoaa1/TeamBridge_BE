import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { EmployeesService } from "./employees.service";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { Employee } from "./schemas/employee.schema";
import { FindEmployeesDto } from "./dto/find-employees.dto";
import { EmployeesResponseDto } from "./dto/employees-response.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { GradeGuard } from "../common/guards/grade.guard";
import { RequiredGrade } from "../common/decorators/required-grade.decorator";

@ApiTags("employees")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, GradeGuard)
@Controller("employees")
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @ApiOperation({ summary: "직원 등록" })
  @ApiResponse({
    status: 201,
    description: "직원이 성공적으로 등록되었습니다.",
    type: Employee,
  })
  @ApiResponse({
    status: 401,
    description: "인증되지 않은 요청",
  })
  async create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @Request() req
  ): Promise<Employee> {
    console.log("req::", req);
    return this.employeesService.create(createEmployeeDto, req.user);
  }

  @Get()
  @RequiredGrade(3)
  @ApiOperation({ summary: "직원 목록 조회" })
  @ApiResponse({
    status: 200,
    description: "직원 목록 조회 성공",
    schema: {
      example: {
        statusCode: 200,
        message: "Success",
        data: {
          items: [
            {
              id: "1",
              name: "홍길동",
              age: 30,
              salary: 50000000,
              hireDate: "2024-04-24T00:00:00.000Z",
              address: "서울시 강남구",
              emergencyContact: "010-1234-5678",
              remainingLeave: 15,
            },
          ],
          totalCount: 150,
        },
      },
    },
  })
  async findAll(@Query() query: FindEmployeesDto) {
    return this.employeesService.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "직원 상세 정보 조회" })
  @ApiResponse({
    status: 200,
    description: "직원 상세 정보 조회 성공",
    schema: {
      example: {
        statusCode: 200,
        message: "Success",
        data: {
          id: "1",
          name: "홍길동",
          age: 30,
          salary: 50000000,
          hireDate: "2024-04-24T00:00:00.000Z",
          address: "서울시 강남구",
          emergencyContact: "010-1234-5678",
          remainingLeave: 15,
          createdAt: "2024-04-24T00:00:00.000Z",
          updatedAt: "2024-04-24T00:00:00.000Z",
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "직원을 찾을 수 없음",
    schema: {
      example: {
        statusCode: 404,
        message: "해당 ID의 직원을 찾을 수 없습니다.",
        data: null,
      },
    },
  })
  async findOne(@Param("id") id: string) {
    return this.employeesService.findOne(id);
  }

  @Patch(":id")
  @RequiredGrade(2)
  @ApiOperation({ summary: "직원 정보 수정" })
  @ApiResponse({
    status: 200,
    description: "직원 정보가 성공적으로 수정되었습니다.",
    type: Employee,
  })
  async update(
    @Param("id") id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto
  ): Promise<Employee> {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "직원 삭제" })
  @ApiResponse({
    status: 200,
    description: "직원 삭제 성공",
    schema: {
      example: {
        statusCode: 200,
        message: "Success",
        data: {
          id: "1",
          name: "홍길동",
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "직원을 찾을 수 없음",
    schema: {
      example: {
        statusCode: 404,
        message: "해당 ID의 직원을 찾을 수 없습니다.",
        data: null,
      },
    },
  })
  async remove(@Param("id") id: string) {
    return this.employeesService.remove(id);
  }

  @RequiredGrade(2)
  @Get("protected-route")
  protectedEndpoint() {
    // ... 엔드포인트 로직 ...
  }
}
