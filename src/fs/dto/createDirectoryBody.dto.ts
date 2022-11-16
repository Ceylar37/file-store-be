import { ApiProperty } from '@nestjs/swagger';

export class CreateDirectoryBodyDto {
  @ApiProperty({ example: 'dir1' })
  name: string;

  @ApiProperty({ example: '6371140a0b2bd25336e7a4cd' })
  directoryId: string | null;
}
