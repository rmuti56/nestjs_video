import { Controller, Post, Body, Get, Put, Delete, Param, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ChatGateway } from '../chat/chat.gateway';

@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private chatGateway: ChatGateway
  ) { }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async get(@Param() params, @Res() res: Response) {
    let user = await this.userService.getUser(params.id);
    if (user) {
      let result = {
        status: HttpStatus.OK,
        success: true,
        data: user
      }
      return res.status(HttpStatus.OK).json(result);
    } else {
      let result = {
        status: HttpStatus.FOUND,
        success: false,
        data: { Msg: 'ไม่พบข้อมูล' }
      }
      return res.status(HttpStatus.FOUND).json(result);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getUsers(@Res() res: Response) {
    let user = await this.userService.getUsers();
    if (user) {
      let result = {
        status: HttpStatus.OK,
        success: true,
        data: user
      }
      return res.status(HttpStatus.OK).json(result);
    } else {
      let result = {
        status: HttpStatus.FOUND,
        success: false,
        data: { Msg: 'ไม่พบข้อมูล' }
      }
      return res.status(HttpStatus.FOUND).json(result);
    }
  }

  @Post()
  createUser(@Body() user: User) {
    return this.userService.createUser(user);
  }

  @Post('test')
  group() {
    this.chatGateway.sendChat('555');
    return this.userService.getUsers();
  }

  @UseGuards(AuthGuard('jwt'))
  @Put()
  async update(@Body() user: User, @Res() res: Response) {
    await this.userService.updateUser(user);
    let result = {
      status: HttpStatus.OK,
      success: true,
      data: { id: user.id }
    }
    return res.status(HttpStatus.OK).json(result);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  deleteUser(@Param() params) {
    return this.userService.deleteUser(params.id);
  }
}
