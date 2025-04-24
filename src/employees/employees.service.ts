import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Employee, EmployeeDocument } from "./schemas/employee.schema";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { User } from "../users/schemas/user.schema";
import { FindEmployeesDto } from "./dto/find-employees.dto";
import { EmployeesResponseDto } from "./dto/employees-response.dto";

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>
  ) {}

  async create(
    createEmployeeDto: CreateEmployeeDto,
    user: User
  ): Promise<Employee> {
    const createdEmployee = new this.employeeModel({
      ...createEmployeeDto,
      createdBy: user.userId,
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
    return this.employeeModel.findById(id).exec();
  }

  async update(
    id: string,
    updateEmployeeDto: CreateEmployeeDto
  ): Promise<Employee> {
    return this.employeeModel
      .findByIdAndUpdate(id, updateEmployeeDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Employee> {
    return this.employeeModel.findByIdAndDelete(id).exec();
  }
}
