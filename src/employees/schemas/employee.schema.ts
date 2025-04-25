import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { Team } from "../../teams/schemas/team.schema";
import { ApiProperty } from "@nestjs/swagger";

export type EmployeeDocument = Employee & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      delete ret.__v;
      return ret;
    },
  },
})
export class Employee {
  @ApiProperty({ example: "홍길동", description: "직원 이름" })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ example: 30, description: "나이" })
  @Prop({ required: true })
  age: number;

  @ApiProperty({ example: "선임 개발자", description: "직책" })
  @Prop({ required: true })
  position: string;

  @ApiProperty({ example: 50000000, description: "연봉" })
  @Prop({ required: true })
  salary: number;

  @ApiProperty({ example: "2024-01-01", description: "입사일" })
  @Prop({ required: true })
  hireDate: Date;

  @Prop()
  resignDate?: Date;

  @ApiProperty({ example: "010-1234-5678", description: "비상 연락처" })
  @Prop()
  emergencyContact: string;

  @ApiProperty({ example: "서울시 강남구", description: "주소" })
  @Prop()
  address: string;

  @ApiProperty({ example: 15, description: "남은 연차" })
  @Prop({ default: 15 })
  remainingLeave: number;

  @Prop()
  memo?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  createdBy: MongooseSchema.Types.ObjectId;

  @ApiProperty({
    example: "507f1f77bcf86cd799439011",
    description: "소속 팀 ID",
    required: true,
  })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Team", required: true })
  teamId: Team;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
