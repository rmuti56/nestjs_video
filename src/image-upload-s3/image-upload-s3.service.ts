import { Req, Res, Injectable, UseInterceptors, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Request } from 'express'
import 'dotenv/config';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import { FileInterceptor } from '@nestjs/platform-express';

const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

@Injectable()
export class ImageUploadS3Service {
  constructor() { }

  async fileupload(@Req() req: Request, @Res() res) {
    return new Promise((resolve, rejects) => {
      try {
        this.upload(req, res, function (error) {
          if (error) {
            rejects(`Failed to upload image file1: ${error}`)
          }
          resolve({ file: req.files, body: req.body })
        });

      } catch (error) {
        console.log(error);
        rejects(`Failed to upload image file2: ${error}`)
      }
    })
  }

  upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: AWS_S3_BUCKET_NAME,
      acl: 'public-read',
      key: function (request, file, cb) {
        cb(null, `${Date.now().toString()} - ${file.originalname}`);
      },
    }),
  }).array('image', 3);
}

