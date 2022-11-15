import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UserCredsDto } from './dto/userCredsDto';
import { ChangeTokenDto } from './dto/changeToken.dto';
import { UserDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.aggregate([
      {
        $project: {
          _id: 0,
          id: '$_id',
          login: 1,
          password: 1,
          token: 1,
        },
      },
    ]);
  }

  async findOne(id: number): Promise<UserDto | undefined> {
    const userFormDB = await this.userModel.findById(id);
    if (!userFormDB) return undefined;
    return {
      id: userFormDB.id,
      login: userFormDB.login,
      password: userFormDB.password,
      token: userFormDB.token,
    };
  }

  async findByLogin(login: string): Promise<UserDto | undefined> {
    const userFormDB = await this.userModel.findOne({ login }).exec();
    if (!userFormDB) return undefined;
    return {
      id: userFormDB.id,
      login: userFormDB.login,
      password: userFormDB.password,
      token: userFormDB.token,
    };
  }

  async create(dto: UserCredsDto): Promise<UserDto> {
    const newUser = new this.userModel(dto);
    const createdUser = await newUser.save();
    return {
      id: createdUser.id,
      login: createdUser.login,
      password: createdUser.password,
      token: createdUser.token,
    };
  }

  async remove(id: number): Promise<void> {
    return this.userModel.findByIdAndDelete(id);
  }

  async updateToken({ token, userId }: ChangeTokenDto) {
    return this.userModel.findByIdAndUpdate(userId, { token });
  }
}
