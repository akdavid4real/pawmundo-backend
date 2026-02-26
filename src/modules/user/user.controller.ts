import { Controller, Get, Put, Body, UseGuards, Request, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
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
    const userId = req.user.id;
    return this.userService.findById(userId);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update authenticated user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully.' })
  @ApiResponse({ status: 400, description: 'Validation error — invalid field values.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async updateProfile(@Request() req, @Body() updateData: UpdateUserDto) {
    const userId = req.user.id;
    return this.userService.updateProfile(userId, updateData);
  }

  @Post('profile/avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload user avatar' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Avatar uploaded successfully.' })
  async uploadAvatar(@Request() req, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded. Please send a file with the field name "file".');
    }
    const userId = req.user.id;
    const url = await this.userService.uploadAvatar(userId, file.buffer, file.mimetype);
    return { url };
  }
}