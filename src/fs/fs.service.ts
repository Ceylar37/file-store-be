import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Directory, DirectoryDocument } from './schemas/directory.schema';
import { Connection, Model, PipelineStage } from 'mongoose';
import { FileInfo, FileInfoDocument } from './schemas/fileInfo.schema';
import { FsDto } from './dto/fs.dto';
import { CreateFileDto } from './dto/createFile.dto';
import { Readable } from 'stream';
import { MongoGridFS } from 'mongo-gridfs';
import { ReadFileDto } from './dto/readFile.dto';
import { ReadableFileDto } from './dto/readableFile.dto';
import { CreateDirectoryDto } from './dto/createDirectory.dto';
import { DirectoryDto } from './dto/directory.dto';
import { UserDirectoryDto } from './dto/userDirectory.dto';
import { FileDto } from './dto/file.dto';

@Injectable()
export class FsService {
  private fsModel: MongoGridFS;

  constructor(
    private readonly usersService: UsersService,
    @InjectModel(Directory.name)
    private readonly directoryModel: Model<DirectoryDocument>,
    @InjectModel(FileInfo.name)
    private readonly fileModel: Model<FileInfoDocument>,
    @InjectConnection() private readonly connection: Connection,
  ) {
    this.fsModel = new MongoGridFS(this.connection.db, 'file-store');
  }

  private async checkDirectoryId(dto: UserDirectoryDto) {
    if (!dto.directoryId) return true;

    const aggregationConfig: PipelineStage[] = [
      {
        $match: {
          userId: dto.userId,
        },
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
        },
      },
    ];
    const directories = await this.directoryModel.aggregate(aggregationConfig);
    if (!directories.some((d) => d.id.toString() === dto.directoryId))
      throw new HttpException(
        `Directory with id:${dto.directoryId} not found`,
        HttpStatus.BAD_REQUEST,
      );

    return true;
  }

  private async getDirectoryFiles(directoryId): Promise<FileDto[]> {
    const aggregationConfig: PipelineStage[] = [
      {
        $match: {
          directoryId,
        },
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          name: 1,
        },
      },
    ];

    return this.fileModel.aggregate(aggregationConfig);
  }

  private async getDirectoryDirectories(directoryId): Promise<FileDto[]> {
    const aggregationConfig: PipelineStage[] = [
      {
        $match: {
          directoryId,
        },
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          name: 1,
        },
      },
    ];

    return this.directoryModel.aggregate(aggregationConfig);
  }

  async getFile(id: string) {
    return this.fsModel.findById(id);
  }

  async readFile(dto: ReadFileDto) {
    const fileInfo = await this.fileModel.findById(dto.id);
    if (fileInfo?.userId !== dto?.userId)
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    return this.fsModel.readFileStream(fileInfo.fileId);
  }

  async getUserFiles(id: string): Promise<FsDto> {
    const aggregationConfig: PipelineStage[] = [
      {
        $match: {
          userId: id,
          directoryId: null,
        },
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          name: 1,
          directoryId: 1,
        },
      },
    ];

    const files = await this.fileModel.aggregate(aggregationConfig);
    const directories = await this.directoryModel.aggregate(aggregationConfig);
    return {
      files,
      directories,
    };
  }

  async createFile(dto: CreateFileDto): Promise<ReadableFileDto> {
    await this.checkDirectoryId({
      userId: dto.userId,
      directoryId: dto.directoryId,
    });
    const directoryFiles = await this.getDirectoryFiles(dto.directoryId);
    if (directoryFiles.some((f) => f.name === dto.name))
      throw new HttpException(
        `File with name: ${dto.name} already exist in this directory`,
        HttpStatus.BAD_REQUEST,
      );
    const stream = Readable.from(dto.file.buffer);
    const createdFile = await this.fsModel.writeFileStream(stream, {
      filename: dto.name,
    });
    const createdFileInfo = new this.fileModel({
      name: dto.name,
      userId: dto.userId,
      directoryId: dto.directoryId,
      fileId: createdFile._id,
    });
    const createdFileInfoFromDB = await createdFileInfo.save();
    return {
      id: createdFileInfoFromDB._id.toString(),
      name: createdFileInfoFromDB.name,
      directoryId: createdFileInfoFromDB.directoryId,
    };
  }

  async createDirectory(dto: CreateDirectoryDto): Promise<DirectoryDto> {
    await this.checkDirectoryId({
      userId: dto.userId,
      directoryId: dto.directoryId,
    });
    const directoryDirectories = await this.getDirectoryDirectories(
      dto.directoryId,
    );
    if (directoryDirectories.some((d) => d.name === dto.name))
      throw new HttpException(
        `Directory with name: ${dto.name} already exist in this directory`,
        HttpStatus.BAD_REQUEST,
      );
    const createdDirectory = new this.directoryModel(dto);
    const createdDirectoryFromDB = await createdDirectory.save();
    return {
      id: createdDirectoryFromDB._id.toString(),
      directoryId: createdDirectoryFromDB.directoryId,
      name: createdDirectoryFromDB.name,
    };
  }

  async getDirectoryContent(dto: UserDirectoryDto): Promise<FsDto> {
    await this.checkDirectoryId(dto);

    return {
      files: await this.getDirectoryFiles(dto.directoryId),
      directories: await this.getDirectoryDirectories(dto.directoryId),
    };
  }
}
