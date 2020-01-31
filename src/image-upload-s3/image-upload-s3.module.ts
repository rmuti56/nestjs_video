import { Module } from '@nestjs/common';
import { ImageUploadS3Service } from './image-upload-s3.service';
import { ImageUploadS3Controller } from './image-upload-s3.controller';

@Module({
  providers: [ImageUploadS3Service],
  controllers: [ImageUploadS3Controller]
})
export class ImageUploadS3Module {}
