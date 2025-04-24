import {
  Controller,
  Get,
  Post,
  Body,
  Put,
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

@ApiTags("employees")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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
    console.log("req::", req.user);
    return this.employeesService.create(createEmployeeDto, req.user);
  }

  @Get()
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
  @ApiOperation({ summary: "Get employee by id" })
  @ApiResponse({ status: 200, description: "Return employee by id" })
  findOne(@Param("id") id: string) {
    return this.employeesService.findOne(id);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update employee by id" })
  @ApiResponse({ status: 200, description: "Employee updated successfully" })
  update(
    @Param("id") id: string,
    @Body() updateEmployeeDto: CreateEmployeeDto
  ) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete employee by id" })
  @ApiResponse({ status: 200, description: "Employee deleted successfully" })
  remove(@Param("id") id: string) {
    return this.employeesService.remove(id);
  }
}
