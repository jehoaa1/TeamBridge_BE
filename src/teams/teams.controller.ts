import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { TeamsService } from "./teams.service";
import { CreateTeamDto } from "./dto/create-team.dto";
import { UpdateTeamDto } from "./dto/update-team.dto";
import { Team } from "./schemas/team.schema";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { GradeGuard } from "../common/guards/grade.guard";
import { RequiredGrade } from "../common/decorators/required-grade.decorator";

@ApiTags("teams")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, GradeGuard)
@Controller("teams")
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @RequiredGrade(2)
  @ApiOperation({ summary: "팀 생성" })
  @ApiResponse({
    status: 201,
    description: "팀이 성공적으로 생성되었습니다.",
    type: Team,
  })
  async create(@Body() createTeamDto: CreateTeamDto): Promise<Team> {
    return this.teamsService.create(createTeamDto);
  }

  @Get()
  @RequiredGrade(3)
  @ApiOperation({ summary: "팀 목록 조회" })
  @ApiResponse({
    status: 200,
    description: "팀 목록 조회 성공",
    type: [Team],
  })
  async findAll(): Promise<Team[]> {
    return this.teamsService.findAll();
  }

  @Patch(":id")
  @RequiredGrade(2)
  @ApiOperation({ summary: "팀 정보 수정" })
  @ApiResponse({
    status: 200,
    description: "팀 정보가 성공적으로 수정되었습니다.",
    type: Team,
  })
  async update(
    @Param("id") id: string,
    @Body() updateTeamDto: UpdateTeamDto
  ): Promise<Team> {
    return this.teamsService.update(id, updateTeamDto);
  }

  @Delete(":id")
  @RequiredGrade(2)
  @ApiOperation({ summary: "팀 삭제" })
  @ApiResponse({
    status: 200,
    description: "팀이 성공적으로 삭제되었습니다.",
    type: Team,
  })
  async remove(@Param("id") id: string): Promise<Team> {
    return this.teamsService.remove(id);
  }

  @Get(":id")
  @RequiredGrade(3)
  @ApiOperation({ summary: "팀 상세 정보 조회" })
  @ApiResponse({
    status: 200,
    description: "팀 상세 정보 조회 성공",
    schema: {
      type: "object",
      properties: {
        _id: { type: "string", example: "507f1f77bcf86cd799439011" },
        name: { type: "string", example: "개발팀" },
        description: {
          type: "string",
          example: "서비스 개발을 담당하는 팀입니다.",
        },
        memberCount: { type: "number", example: 5 },
        members: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string", example: "507f1f77bcf86cd799439012" },
              name: { type: "string", example: "홍길동" },
              age: { type: "number", example: 30 },
              position: { type: "string", example: "선임 개발자" },
              hireDate: {
                type: "string",
                format: "date-time",
                example: "2024-01-01T00:00:00.000Z",
              },
              emergencyContact: { type: "string", example: "010-1234-5678" },
            },
          },
        },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "팀을 찾을 수 없습니다.",
  })
  async findOne(@Param("id") id: string): Promise<any> {
    return this.teamsService.findOne(id);
  }
}
