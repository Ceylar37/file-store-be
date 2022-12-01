import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FsService } from './fs.service';
import { JwtService } from '@nestjs/jwt';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/auth.guard';
import { CreateFileBodyDto } from './dto/createFileBody.dto';
import { CreateDirectoryBodyDto } from './dto/createDirectoryBody.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FsDto } from './dto/fs.dto';
import {
  FileUploadDto,
  HttpForbidden,
  HttpUnauthorized,
} from '../swagger.types';
import { ReadableFileDto } from './dto/readableFile.dto';
import { DirectoryDto } from './dto/directory.dto';

@ApiTags('File System')
@Controller('files')
export class FsController {
  constructor(
    private readonly fsService: FsService,
    private readonly jwtService: JwtService,
  ) {}

  @ApiResponse({ status: HttpStatus.OK, type: FsDto })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: HttpUnauthorized,
  })
  @UseGuards(AuthGuard)
  @Get('my')
  async getMyFiles(@Req() req): Promise<FsDto> {
    return this.fsService.getUserFiles(req.user.id);
  }

  // @UseGuards(AuthGuard)
  // @Get('oneFile/:id')
  // async getFile(@Param('id') id: string) {
  //   const fileData = await this.fsService.getFile(id);
  //
  //   return {
  //     id: fileData._id,
  //   };
  // }

  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: HttpUnauthorized,
  })
  @ApiForbiddenResponse({ status: HttpStatus.FORBIDDEN, type: HttpForbidden })
  @UseGuards(AuthGuard)
  @Get('read/:id/:name')
  async readFile(@Param('id') id: string, @Req() req) {
    const fileStream = await this.fsService.readFile({
      id,
      userId: req.user.id,
    });
    return new StreamableFile(fileStream);
  }

  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: HttpStatus.OK, type: ReadableFileDto })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: HttpUnauthorized,
  })
  @ApiBody({
    type: FileUploadDto,
  })
  @UseGuards(AuthGuard)
  @Post('uploadFile')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateFileBodyDto,
    @Req() req,
  ) {
    if (!file)
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    return await this.fsService.createFile({
      userId: req.user.id,
      file,
      name: body.name,
      directoryId: body.directoryId,
    });
  }

  @ApiResponse({ status: HttpStatus.OK, type: DirectoryDto })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: HttpUnauthorized,
  })
  @ApiForbiddenResponse({ status: HttpStatus.FORBIDDEN, type: HttpForbidden })
  @UseGuards(AuthGuard)
  @Post('createDirectory')
  async createDirectory(@Req() req, @Body() body: CreateDirectoryBodyDto) {
    return await this.fsService.createDirectory({
      userId: req.user.id,
      name: body.name,
      directoryId: body.directoryId,
    });
  }

  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: FsDto })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: HttpUnauthorized,
  })
  @ApiForbiddenResponse({ status: HttpStatus.FORBIDDEN, type: HttpForbidden })
  @UseGuards(AuthGuard)
  @Get('directoryContent/:id')
  async getDirectoryContent(@Req() req, @Param('id') directoryId) {
    return await this.fsService.getDirectoryContent({
      userId: req.user.id,
      directoryId,
    });
  }
}
