export class CreateFileDto {
  userId: string;
  name: string;
  file: Express.Multer.File;
  directoryId: string | null;
}
