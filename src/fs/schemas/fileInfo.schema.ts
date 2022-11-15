import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class FileInfo {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ default: null })
  directoryId: string | null;

  @Prop({ required: true })
  fileId: string;
}

export type FileInfoDocument = HydratedDocument<FileInfo>;

export const fileInfoSchema = SchemaFactory.createForClass(FileInfo);
