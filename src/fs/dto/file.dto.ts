import { ApiProperty } from '@nestjs/swagger';

export class FileDto {
  @ApiProperty({ example: '6374b264f1eb3892023e3bdb' })
  id: string;

  @ApiProperty({ example: 'fileName.docx' })
  name: string;

  @ApiProperty({ example: '6371140a0b2bd25336e7a4cd' })
  directoryId: string | null;

  fileId: string;
}
