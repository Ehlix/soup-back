import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user-dto';
import { errMessages } from '../../common/constants/errMessages';
import { UpdateUserDto } from './dto/update-user-dto';
import { UserProfile } from '../user-profile/user-profile.model';

type UserWithProfile = User & {
  userProfile: UserProfile | null;
};

type PublicUser = Omit<UserWithProfile, 'password'>;

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
  ) {}

  async createUser(dto: CreateUserDto) {
    const candidate = await this.getUserByEmail(dto.email);
    if (candidate) {
      throw new BadRequestException(errMessages.USER_ALREADY_EXISTS);
    }
    const password = await this.hashPassword(dto.password);
    return this.userRepository.create({ ...dto, password });
  }

  async getUsers(): Promise<UserWithProfile[]> {
    return this.userRepository.findAll({
      attributes: { exclude: ['password'] },
      include: [{ model: UserProfile, required: false }],
    });
  }

  async getUserByEmail(email: string): Promise<UserWithProfile> {
    try {
      return this.userRepository.findOne({
        where: { email },
        include: [{ model: UserProfile, required: false }],
      });
    } catch (e) {
      throw new BadRequestException(errMessages.USER_NOT_FOUND);
    }
  }

  async getUserById(id: string): Promise<UserWithProfile> {
    try {
      return await this.userRepository.findOne({
        where: { id },
        include: [{ model: UserProfile, required: false }],
      });
    } catch (e) {
      throw new BadRequestException(errMessages.USER_NOT_FOUND);
    }
  }

  async getPublicUser(email: string): Promise<PublicUser> {
    return await this.userRepository.findOne({
      where: { email },
      attributes: { exclude: ['password'] },
      include: [{ model: UserProfile, required: false }],
    });
  }

  async updateUser(email: string, dto: UpdateUserDto) {
    const candidate = await this.getUserByEmail(dto.email);
    if (candidate) {
      throw new BadRequestException(errMessages.EMAIL_ALREADY_EXISTS);
    }
    await this.userRepository.update(dto, { where: { email } });
    return this.getPublicUser(dto.email);
  }

  async deleteUser(email: string) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new BadRequestException(errMessages.USER_NOT_FOUND);
    }
    await this.userRepository.destroy({ where: { id: user.id } });
    return true;
  }

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }
}
