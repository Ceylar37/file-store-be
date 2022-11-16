import { ApiProperty } from '@nestjs/swagger';

export class HttpBadRequest {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty()
  message: string;
}

export class HttpForbidden {
  @ApiProperty({ example: 403 })
  statusCode: number;

  @ApiProperty()
  message: string;
}

export class HttpNotFound {
  @ApiProperty({ example: 404 })
  statusCode: number;

  @ApiProperty()
  message: string;
}

export class HttpUnauthorized {
  @ApiProperty({ example: 401 })
  statusCode: 401;

  @ApiProperty()
  message: 'User not authorized';

  @ApiProperty()
  error: 'Unauthorized';
}

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;

  @ApiProperty({ example: 'fileName.docx' })
  name: string;

  @ApiProperty({ example: null })
  directoryId: string;
}
