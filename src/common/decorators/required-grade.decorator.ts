import { SetMetadata } from "@nestjs/common";

import { ConfigService } from "@nestjs/config";

const configService = new ConfigService();
export const REQUIRED_GRADE_KEY =
  configService.get<string>("REQUIRED_GRADE_KEY") || "requiredGrade";
export const RequiredGrade = (grade: number) =>
  SetMetadata(REQUIRED_GRADE_KEY, grade);
