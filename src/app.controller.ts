import { Controller, Get, Req, Post, UseGuards, Body, UseInterceptors, UploadedFile, UploadedFiles, Param, Res, BadRequestException } from '@nestjs/common';
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
  @Get('auth/facebook')
  async getTokenAfterFacebookSignIn(@Req() req) {
    return req.user
  }

  @Get('auth/google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    console.log('test')
    // initiates the Google OAuth2 login flow
  }

  @Get('auth/google/callback')
  @UseGuards(AuthGuard('google'))
  googleLoginCallback(@Req() req, @Res() res) {
    // handles the Google OAuth2 callback
    const jwt: string = req.user.jwt;
    if (jwt)
      res.redirect('http://localhost:5000?token=' + jwt);
    else
      res.redirect('http://localhost:5000');
  }

  @Get('auth/github')
  @UseGuards(AuthGuard('github'))
  githubLogin() {
    console.log('test')
    // initiates the github  login flow
  }

  @Get('auth/github/callback')
  @UseGuards(AuthGuard('github'))
  githubLoginCallback(@Req() req, @Res() res) {
    // handles the github  callback
    const jwt: string = req.user.jwt;
    if (jwt)
      res.redirect('http://localhost:5000?token=' + jwt);
    else
      res.redirect('http://localhost:5000');
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
      }),
      fileFilter: imageFileFilter,
      limits: {
        fileSize: 1 * 1024 * 1024
      }
    }),
  )
  async uploadFile(@UploadedFile() file, @Body() user: any) {
    if (!file) {
      throw new BadRequestException('image is required')
    }

    const response = {
      originalname: file.originalname,
      filename: file.filename,
    }
    return response;
  }

  // @Post('uploadImage')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadFile(@Body() user: any) {
  //   console.log(user.test)
  //   // const response = {
  //   //   originalname: file.originalname,
  //   //   filename: file.filename,
  //   // }
  //   return user;
  // }

  @Post('uploadMultiple')
  @UseInterceptors(
    FilesInterceptor('image', 20, {
      storage: diskStorage({
        destination: './files/image',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
      limits: {
        fileSize: 1 * 1024 * 1024
      }
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


