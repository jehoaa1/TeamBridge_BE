import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

export type EmployeeDocument = Employee & Document;

@Schema({ timestamps: true })
export class Employee {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  salary: number;

  @Prop({ required: true })
  hireDate: Date;

  @Prop()
  resignDate?: Date;

  @Prop({ required: true })
  emergencyContact: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true, default: 15 })
  remainingLeave: number;

  @Prop()
  memo?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  createdBy: MongooseSchema.Types.ObjectId;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
