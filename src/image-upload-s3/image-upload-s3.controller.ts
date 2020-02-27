import { Controller, Post, Req, Res } from '@nestjs/common';
import { ImageUploadS3Service } from './image-upload-s3.service';

@Controller('image-upload-s3')
export class ImageUploadS3Controller {
  constructor(private readonly imageUploadService: ImageUploadS3Service) { }

  @Post()
  async create(@Req() request, @Res() response) {
    return this.imageUploadService.fileupload(request, response);
  }
}
