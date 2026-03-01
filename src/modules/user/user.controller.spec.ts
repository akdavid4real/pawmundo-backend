import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { BadRequestException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const mockUserService = {
    findById: jest.fn(),
    updateProfile: jest.fn(),
    uploadAvatar: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return the user profile', async () => {
      const mockUser = { id: 'user-id', email: 'test@example.com' };
      mockUserService.findById.mockResolvedValue(mockUser);

      const result = await controller.getProfile({ user: { id: 'user-id' } });

      expect(mockUserService.findById).toHaveBeenCalledWith('user-id');
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateProfile', () => {
    it('should update and return the updated user profile', async () => {
      const updateDto: UpdateUserDto = { firstName: 'Jane' } as any;
      const updatedUser = { id: 'user-id', firstName: 'Jane' };
      mockUserService.updateProfile.mockResolvedValue(updatedUser);

      const result = await controller.updateProfile({ user: { id: 'user-id' } }, updateDto);

      expect(mockUserService.updateProfile).toHaveBeenCalledWith('user-id', updateDto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('uploadAvatar', () => {
    it('should upload an avatar and return the URL', async () => {
      const mockFile = {
        buffer: Buffer.from('test'),
        mimetype: 'image/png',
      } as Express.Multer.File;

      const publicUrl = 'http://public.url/avatar.png';
      mockUserService.uploadAvatar.mockResolvedValue(publicUrl);

      const result = await controller.uploadAvatar({ user: { id: 'user-id' } }, mockFile);

      expect(mockUserService.uploadAvatar).toHaveBeenCalledWith('user-id', mockFile.buffer, mockFile.mimetype);
      expect(result).toEqual({ url: publicUrl });
    });

    it('should throw BadRequestException if file is not provided', async () => {
      await expect(controller.uploadAvatar({ user: { id: 'user-id' } }, undefined as any))
        .rejects
        .toThrow(BadRequestException);
    });
  });
});
