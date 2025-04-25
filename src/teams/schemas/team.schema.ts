import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { ApiProperty } from "@nestjs/swagger";

export type TeamDocument = Team & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      delete ret.__v;
      return ret;
    },
  },
})
export class Team {
  @ApiProperty({ example: "개발팀", description: "팀 이름" })
  @Prop({ required: true, unique: true })
  name: string;

  @ApiProperty({
    example: "서비스 개발을 담당하는 팀입니다.",
    description: "팀 설명",
  })
  @Prop()
  description: string;

  @ApiProperty({
    example: 5,
    description: "팀 소속 직원 수 (퇴사자 제외)",
    required: false,
  })
  memberCount?: number;
}

export const TeamSchema = SchemaFactory.createForClass(Team);
TeamSchema.index({ name: 1 }, { unique: true });
