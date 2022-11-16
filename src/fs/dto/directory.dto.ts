import { ApiProperty } from '@nestjs/swagger';

export class DirectoryDto {
  @ApiProperty({ example: '63711449a7073582fe8a4ca9' })
  id: string;

  @ApiProperty({ example: 'dir2' })
  name: string;

  @ApiProperty({ example: '6371140a0b2bd25336e7a4cd' })
  directoryId: string | null;
}
