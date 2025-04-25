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
}
