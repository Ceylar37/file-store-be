import { DirectoryDto } from './directory.dto';
import { FileDto } from './file.dto';
import { ApiProperty } from '@nestjs/swagger';

const dDto: DirectoryDto = {
  id: '6374b258f1eb3892023e3bd7',
  directoryId: null,
  name: 'dir1',
};

const fDto: Omit<FileDto, 'fileId'> = {
  id: '6374b264f1eb3892023e3bdb',
  directoryId: null,
  name: 'dir1',
};

export class FsDto {
  @ApiProperty({ example: [dDto] })
  directories: DirectoryDto[];

  @ApiProperty({ example: [fDto] })
  files: FileDto[];
}
