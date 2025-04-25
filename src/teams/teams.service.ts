import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Team, TeamDocument } from "./schemas/team.schema";
import { CreateTeamDto } from "./dto/create-team.dto";

@Injectable()
export class TeamsService {
  constructor(
    @InjectModel(Team.name) private readonly teamModel: Model<TeamDocument>
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

  async findAll(): Promise<Team[]> {
    return this.teamModel.find().exec();
  }

  async findOne(id: string): Promise<Team> {
    const team = await this.teamModel.findById(id).exec();
    if (!team) {
      throw new NotFoundException(`팀을 찾을 수 없습니다. ID: ${id}`);
    }
    return team;
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
