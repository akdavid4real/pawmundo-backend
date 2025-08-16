import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { User } from './schemas/user.schema';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  const mockUser = {
    _id: 'userId123',
    email: 'test@example.com',
    password: 'hashedPassword',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    isEmailVerified: false,
    save: jest.fn().mockResolvedValue(this),
  };

  const mockUserModel: any = jest.fn().mockImplementation((dto) => ({
    ...dto,
    save: jest.fn().mockResolvedValue({ ...dto, _id: 'userId123' }),
    toObject: jest.fn().mockReturnValue({ ...dto, _id: 'userId123' })
  }));
  mockUserModel.findOne = jest.fn();
  mockUserModel.findById = jest.fn();
  mockUserModel.findByIdAndUpdate = jest.fn();
  mockUserModel.create = jest.fn();

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('jwt-token'),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    };

    it('should register a new user successfully', async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockUserModel.mockReturnValue({
        save: jest.fn().mockResolvedValue(mockUser),
        toObject: jest.fn().mockReturnValue(mockUser)
      });

      const result = await service.register(registerDto);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: registerDto.email });
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 12);
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('user');
    });

    it('should throw ConflictException if user already exists', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    const loginDto = { email: 'test@example.com', password: 'password123' };

    it('should login user successfully', async () => {
      mockUserModel.findOne.mockResolvedValue({
        ...mockUser,
        toObject: jest.fn().mockReturnValue(mockUser)
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockUserModel.findByIdAndUpdate.mockResolvedValue(mockUser);

      const result = await service.login(loginDto);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: loginDto.email });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('user');
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('changePassword', () => {
    const changePasswordDto = {
      currentPassword: 'oldPassword',
      newPassword: 'newPassword123',
    };

    it('should change password successfully', async () => {
      mockUserModel.findById.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPassword');
      mockUserModel.findByIdAndUpdate.mockResolvedValue(mockUser);

      await service.changePassword('userId123', changePasswordDto);

      expect(bcrypt.compare).toHaveBeenCalledWith(changePasswordDto.currentPassword, mockUser.password);
      expect(bcrypt.hash).toHaveBeenCalledWith(changePasswordDto.newPassword, 12);
      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for wrong current password', async () => {
      mockUserModel.findById.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.changePassword('userId123', changePasswordDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});