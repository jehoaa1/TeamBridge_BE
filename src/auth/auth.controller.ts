import { Controller, Post, Body, UseGuards, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import {
  ListResponseDto,
  LoginResponseDto,
  RegisterResponseDto,
} from "./dto/auth-response.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  @ApiOperation({ summary: "로그인" })
  @ApiResponse({
    status: 200,
    description: "로그인 성공",
    type: LoginResponseDto,
  })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return await this.authService.login(loginDto);
  }

  @Get("list")
  @ApiOperation({ summary: "회원 정보" })
  @ApiResponse({
    status: 200,
    description: "회원정보 불러오기",
    type: ListResponseDto,
  })
  async list(): Promise<ListResponseDto[]> {
    return await this.authService.getUserList();
  }

  @Post("register")
  @ApiOperation({ summary: "회원가입" })
  @ApiResponse({
    status: 201,
    description: "회원가입 성공",
    type: RegisterResponseDto,
  })
  async register(
    @Body() registerDto: RegisterDto
  ): Promise<RegisterResponseDto> {
    return await this.authService.register(registerDto);
  }
}
