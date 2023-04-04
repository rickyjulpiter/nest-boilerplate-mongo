import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { v4 as uuidv4 } from 'uuid';
@Schema()
export class User {
  @Prop({ default: uuidv4 })
  id: string;

  @Prop({ required: true })
  fullName: string;

  @Prop()
  phone: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  email: string;

  @Prop({ default: true })
  subscription: boolean;

  @Prop({ default: true })
  status: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
