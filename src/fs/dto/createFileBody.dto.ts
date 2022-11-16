import { ApiProperty } from '@nestjs/swagger';

export class CreateFileBodyDto {
  @ApiProperty({ example: 'fileName.docx' })
  name: string;

  @ApiProperty({ example: null })
  directoryId: string;
}
