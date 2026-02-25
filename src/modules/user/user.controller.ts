import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('profile')
  @ApiOperation({ summary: 'Get authenticated user profile' })
  @ApiResponse({ status: 200, description: 'Returns the full user profile with preferences.' })
  @ApiResponse({ status: 401, description: 'Unauthorized — invalid or missing JWT.' })
  async getProfile(@Request() req) {
    const userId = req.user.userId || req.user._id || req.user.id;
    return this.userService.findById(userId);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update authenticated user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully.' })
  @ApiResponse({ status: 400, description: 'Validation error — invalid field values.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async updateProfile(@Request() req, @Body() updateData: UpdateUserDto) {
    const userId = req.user.userId || req.user._id || req.user.id;
    return this.userService.updateProfile(userId, updateData);
  }
}