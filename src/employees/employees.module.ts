import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { EmployeesController } from "./employees.controller";
import { EmployeesService } from "./employees.service";
import { Employee, EmployeeSchema } from "./schemas/employee.schema";
import { TeamsModule } from "../teams/teams.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Employee.name, schema: EmployeeSchema },
    ]),
    PassportModule.register({ defaultStrategy: "jwt" }),
    TeamsModule,
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}
