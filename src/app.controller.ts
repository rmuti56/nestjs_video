import { Controller, Get, Req, Post, UseGuards, Body, UseInterceptors, UploadedFile, UploadedFiles, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from './utils/file-uploading.utils';
import * as fs from 'fs';
// import { Response } from 'express-serve-static-core';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService
  ) { }

  @Get()
  getHello(@Req() request: Request): string {
    return this.appService.getHello();
  }

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Req() request: Request) {
    return this.authService.login(request.user);
  }

  @UseGuards(AuthGuard('facebook-token'))
  @Get('facebook')
  async getTokenAfterFacebookSignIn(@Req() req) {
    return req.body.access_token
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Req() request: Request) {
    return request.user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('profile')
  postProfile(@Req() request: Request, @Body() user: any) {
    return user;
  }


  //อัพโหลดภาพเดียว
  @Post('uploadImage')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files/image',
        filename: editFileName,
        limits: { fileSize: 10 * 1024 * 1024 }
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadFile(@UploadedFile() file) {
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    }
    return response;
  }

  @Post('uploadMultiple')
  @UseInterceptors(
    FilesInterceptor('image', 20, {
      storage: diskStorage({
        destination: './files/image',
        filename: editFileName,
        limits: { fileSize: 10 * 1024 * 1024 }
      }),
      fileFilter: imageFileFilter,
    })
  )
  async uploadMultipleFiles(@UploadedFiles() files) {
    const response = [];
    files.forEach(file => {
      const fileReponse = {
        originalname: file.originalname,
        filename: file.filename,
      };
      response.push(fileReponse);
    });
    return response;
  }

  @Post('uploadVideo')
  @UseInterceptors(
    FileInterceptor('video', {
      storage: diskStorage({
        destination: './files/video',
        filename: editFileName
      }),
    }),
  )
  async uploadVDOFile(@UploadedFile() file) {
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    }
    return response;
  }

  @Get('image/:imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res: Response) {
    return res.sendFile(image, { root: './files/image' });
  }

  @Get('download/:imgpath')
  loadedFile(@Param('imgpath') image, @Res() res) {
    const path = `./files/image/${image}`;
    return res.download(path);
  }

  @Get('video/:videopath')
  seeUploadedVideoFile(@Param('videopath') video, @Res() res, @Req() req) {
    const path = `./files/video/${video}`;
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0], 10)
      const end = parts[1]
        ? parseInt(parts[1], 10)
        : fileSize - 1
      const chunksize = (end - start) + 1
      const file = fs.createReadStream(path, { start, end })
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(200, head)
      fs.createReadStream(path).pipe(res)
    }
  }

  @Post('profile1')
  postProfileTest(@Req() request: Request, @Body() user: any) {
    console.log('user')
    return user;
  }
}


