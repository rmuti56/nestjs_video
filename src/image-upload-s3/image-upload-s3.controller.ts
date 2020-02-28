import { Controller, Post, Req, Res, UseInterceptors, NotFoundException } from '@nestjs/common';
import { ImageUploadS3Service } from './image-upload-s3.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('image-upload-s3')
export class ImageUploadS3Controller {
  constructor(private readonly imageUploadService: ImageUploadS3Service) { }

  @Post()
  async create(@Req() request, @Res() response: Response) {
    try {
      const resp = await this.imageUploadService.fileupload(request, response);
      return response.json(resp)
    } catch (error) {
      throw new NotFoundException(error)
    }

  }
}
