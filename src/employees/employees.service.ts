import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Employee, EmployeeDocument } from "./schemas/employee.schema";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { User } from "../users/schemas/user.schema";
import { FindEmployeesDto } from "./dto/find-employees.dto";
import { EmployeesResponseDto } from "./dto/employees-response.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>
  ) {}

  async create(
    createEmployeeDto: CreateEmployeeDto,
    user: any
  ): Promise<Employee> {
    console.log("Creating employee with user:", user); // 디버깅용
    const createdEmployee = new this.employeeModel({
      ...createEmployeeDto,
      createdBy: user.userId, // JWT 전략에서 반환한 userId 사용
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
    const employee = await this.employeeModel.findById(id).exec();
    if (!employee) {
      throw new NotFoundException("해당 ID의 직원을 찾을 수 없습니다.");
    }
    return employee;
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto
  ): Promise<Employee> {
    const updatedEmployee = await this.employeeModel
      .findByIdAndUpdate(id, updateEmployeeDto, { new: true })
      .exec();

    if (!updatedEmployee) {
      throw new NotFoundException("해당 ID의 직원을 찾을 수 없습니다.");
    }
    return updatedEmployee;
  }

  async remove(id: string): Promise<Employee> {
    const deletedEmployee = await this.employeeModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedEmployee) {
      throw new NotFoundException("해당 ID의 직원을 찾을 수 없습니다.");
    }
    return deletedEmployee;
  }
}
