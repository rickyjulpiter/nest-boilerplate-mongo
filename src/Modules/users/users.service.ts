import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserDto } from './dto/user.dto';

import { User } from '../../Schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(user: UserDto, password: Promise<string>): Promise<User> {
    const createdUser = new this.userModel({
      fullName: user.fullName,
      password,
      email: user.email,
      phone: user.phone,
      subscription: user.subscription,
      status: user.status,
    });

    return createdUser.save();
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email });
  }

  async updateStatus(email: string): Promise<any> {
    return this.userModel.findOneAndUpdate({ email }, { status: true });
  }

  async updateProfile(userId: string, user): Promise<any> {
    return this.userModel.findOneAndUpdate({ id: userId }, { ...user });
  }

  async updatePassword(userId: string, password: string): Promise<any> {
    return this.userModel.findOneAndUpdate({ id: userId }, { password });
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
