import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user-dto';
import { errMessages } from '../../common/constants/errMessages';
import { UpdateUserDto } from './dto/update-user-dto';

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

  async getUsers() {
    return this.userRepository.findAll();
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async getUserById(id: string): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async getPublicUser(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      attributes: { exclude: ['password', 'refreshTokens'] },
    });
    return user;
  }

  async updateUser(email: string, dto: UpdateUserDto) {
    const userByDtoEmail = await this.getUserByEmail(dto.email);
    if (!userByDtoEmail) {
      await this.userRepository.update(dto, { where: { email } });
      return this.getPublicUser(dto.email);
    }
    throw new BadRequestException(errMessages.USER_ALREADY_EXISTS);
  }

  async deleteUser(email: string) {
    const user = await this.getUserByEmail(email);
    if (user) {
      await this.userRepository.destroy({ where: { id: user.id } });
      return true;
    }
    throw new BadRequestException(errMessages.USER_NOT_FOUND);
  }

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }
}
