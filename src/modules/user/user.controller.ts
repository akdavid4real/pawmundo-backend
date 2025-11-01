import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@Request() req) {
    const userId = req.user.userId || req.user._id || req.user.id;
    return this.userService.findById(userId);
  }

  @Put('profile')
  async updateProfile(@Request() req, @Body() updateData: UpdateUserDto) {
    const userId = req.user.userId || req.user._id || req.user.id;
    return this.userService.updateProfile(userId, updateData);
  }
}