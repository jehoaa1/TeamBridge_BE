import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Employee, EmployeeDocument } from "./schemas/employee.schema";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { User } from "../users/schemas/user.schema";
import { FindEmployeesDto } from "./dto/find-employees.dto";
import { EmployeesResponseDto } from "./dto/employees-response.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { TeamsService } from "../teams/teams.service";

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
    private readonly teamsService: TeamsService
  ) {}

  async create(
    createEmployeeDto: CreateEmployeeDto,
    user: any
  ): Promise<Employee> {
    // 팀 존재 여부 확인
    await this.teamsService.findOne(createEmployeeDto.teamId);

    const createdEmployee = new this.employeeModel({
      ...createEmployeeDto,
      createdBy: new Types.ObjectId(user.userId),
    });
    return createdEmployee.save();
  }

  async findAll(query: FindEmployeesDto): Promise<EmployeesResponseDto> {
    const { page = 1, limit = 10, search, minSalary, maxSalary } = query;
    const skip = (page - 1) * limit;

    // 검색 조건 구성
    const conditions: any = {};

    if (search) {
      conditions.$or = [
        { name: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
      ];
    }

    if (minSalary || maxSalary) {
      conditions.salary = {};
      if (minSalary) conditions.salary.$gte = minSalary;
      if (maxSalary) conditions.salary.$lte = maxSalary;
    }

    // 병렬로 총 개수와 페이징된 데이터 조회
    const [totalCount, items] = await Promise.all([
      this.employeeModel.countDocuments(conditions),
      this.employeeModel
        .find(conditions)
        .populate("teamId", "name description")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
    ]);

    return {
      items,
      totalCount,
    };
  }

  async findOne(id: string): Promise<Employee> {
    const employee = await this.employeeModel
      .findById(id)
      .populate("teamId", "name description")
      .exec();

    if (!employee) {
      throw new NotFoundException(`직원을 찾을 수 없습니다. ID: ${id}`);
    }
    return employee;
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto
  ): Promise<Employee> {
    // 팀 ID가 변경되는 경우 팀 존재 여부 확인
    if (updateEmployeeDto.teamId) {
      await this.teamsService.findOne(updateEmployeeDto.teamId);
    }

    const updatedEmployee = await this.employeeModel
      .findByIdAndUpdate(id, updateEmployeeDto, { new: true })
      .populate("teamId", "name description")
      .exec();

    if (!updatedEmployee) {
      throw new NotFoundException(`직원을 찾을 수 없습니다. ID: ${id}`);
    }
    return updatedEmployee;
  }

  async remove(id: string): Promise<Employee> {
    const deletedEmployee = await this.employeeModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedEmployee) {
      throw new NotFoundException(`직원을 찾을 수 없습니다. ID: ${id}`);
    }
    return deletedEmployee;
  }
}
