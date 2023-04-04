import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema()
export class Otp {
  @Prop({ default: uuidv4 })
  id: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  otpCode: string;

  @Prop({ required: true })
  expiredAt: Date;

  @Prop({ default: true })
  status: boolean;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
