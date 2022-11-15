import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Directory {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ default: null })
  directoryId: string | null;
}

export type DirectoryDocument = HydratedDocument<Directory>;

export const DirectorySchema = SchemaFactory.createForClass(Directory);
