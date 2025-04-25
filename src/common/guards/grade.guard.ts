import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { REQUIRED_GRADE_KEY } from "../decorators/required-grade.decorator";

@Injectable()
export class GradeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredGrade = this.reflector.getAllAndOverride<number>(
      REQUIRED_GRADE_KEY,
      [context.getHandler(), context.getClass()]
    );

    // 등급 요구사항이 없으면 접근 허용
    if (!requiredGrade) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // 사용자가 없거나 등급이 없으면 접근 거부
    if (!user || !user.grade) {
      return false;
    }

    // 사용자의 등급이 요구 등급보다 낮거나 같아야 접근 허용
    // (숫자가 낮을수록 높은 등급을 의미)
    return user.grade <= requiredGrade;
  }
}
