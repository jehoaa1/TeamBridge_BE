import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  // 가상 필드
  userId: string;

  createdAt: Date;
}

const UserSchema = SchemaFactory.createForClass(User);

// 가상 필드 설정
UserSchema.virtual("userId").get(function () {
  return this._id.toHexString();
});

// JSON 변환 시 가상 필드 포함
UserSchema.set("toJSON", {
  virtuals: true,
  transform: (_, converted) => {
    delete converted._id;
    delete converted.__v;
    return converted;
  },
});

export { UserSchema };
