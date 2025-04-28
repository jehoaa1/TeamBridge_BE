import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import {
  ListResponseDto,
  LoginResponseDto,
  RegisterResponseDto,
} from "./dto/auth-response.dto";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException("이메일 또는 비밀번호가 잘못되었습니다.");
    }

    const payload = {
      sub: user.userId.toString(),
      email: user.email,
      grade: user.grade,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.userId.toString(),
        email: user.email,
        name: user.name,
        grade: user.grade,
        createdAt: user.createdAt,
      },
    };
  }

  async getUserList(): Promise<ListResponseDto[]> {
    const user = await this.usersService.getUserList();

    return user.map((user) => ({
      email: user.email,
      name: user.name,
      grade: user.grade,
      createdAt: user.createdAt,
    }));
  }

  async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    return {
      id: user.userId,
      email: user.email,
      name: user.name,
      grade: user.grade,
      createdAt: user.createdAt,
    };
  }
}
