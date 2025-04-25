import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Team, TeamDocument } from "./schemas/team.schema";
import { CreateTeamDto } from "./dto/create-team.dto";
import {
  Employee,
  EmployeeDocument,
} from "../employees/schemas/employee.schema";

@Injectable()
export class TeamsService {
  constructor(
    @InjectModel(Team.name) private readonly teamModel: Model<TeamDocument>,
    @InjectModel(Employee.name)
    private readonly employeeModel: Model<EmployeeDocument>
  ) {}

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    try {
      const createdTeam = new this.teamModel(createTeamDto);
      return await createdTeam.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          `이미 존재하는 팀 이름입니다: ${createTeamDto.name}`
        );
      }
      throw error;
    }
  }

  async findAll(): Promise<any[]> {
    const teams = await this.teamModel.find().exec();
    const teamsWithMemberCount = await Promise.all(
      teams.map(async (team) => {
        const memberCount = await this.employeeModel.countDocuments({
          teamId: team._id,
          resignDate: { $exists: false }, // 퇴사하지 않은 직원만 카운트
        });
        return {
          ...team.toJSON(),
          memberCount,
        };
      })
    );
    return teamsWithMemberCount;
  }

  async findOne(id: string): Promise<any> {
    const team = await this.teamModel.findById(id).exec();
    if (!team) {
      throw new NotFoundException(`팀을 찾을 수 없습니다. ID: ${id}`);
    }

    // 현재 재직 중인 팀원 목록 조회
    const members = await this.employeeModel
      .find({
        teamId: team._id,
        resignDate: { $exists: false },
      })
      .select("name age position hireDate emergencyContact") // 필요한 필드만 선택
      .exec();

    const memberCount = members.length;

    return {
      ...team.toJSON(),
      memberCount,
      members,
    };
  }

  async update(
    id: string,
    updateTeamDto: Partial<CreateTeamDto>
  ): Promise<Team> {
    try {
      const updatedTeam = await this.teamModel
        .findByIdAndUpdate(id, updateTeamDto, { new: true })
        .exec();
      if (!updatedTeam) {
        throw new NotFoundException(`팀을 찾을 수 없습니다. ID: ${id}`);
      }
      return updatedTeam;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          `이미 존재하는 팀 이름입니다: ${updateTeamDto.name}`
        );
      }
      throw error;
    }
  }

  async remove(id: string): Promise<Team> {
    const deletedTeam = await this.teamModel.findByIdAndDelete(id).exec();
    if (!deletedTeam) {
      throw new NotFoundException(`팀을 찾을 수 없습니다. ID: ${id}`);
    }
    return deletedTeam;
  }
}
