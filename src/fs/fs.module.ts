import { Module } from '@nestjs/common';
import { FsController } from './fs.controller';
import { FsService } from './fs.service';
import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Directory, DirectorySchema } from './schemas/directory.schema';
import { fileInfoSchema, FileInfo } from './schemas/fileInfo.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [FsController],
  providers: [FsService],
  imports: [
    UsersModule,
    AuthModule,
    MongooseModule.forFeature([
      { name: Directory.name, schema: DirectorySchema },
      { name: FileInfo.name, schema: fileInfoSchema },
    ]),
  ],
})
export class FsModule {}
