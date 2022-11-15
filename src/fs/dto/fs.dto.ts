import { DirectoryDto } from './directory.dto';
import { FileDto } from './file.dto';

export class FsDto {
  directories: DirectoryDto[];
  files: FileDto[];
}
