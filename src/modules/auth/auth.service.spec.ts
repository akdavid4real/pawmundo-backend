// @ts-nocheck
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Types } from 'mongoose';
import { AuthService } from './auth.service';
import { User } from './schemas/user.schema';
import { MailService } from '../../common/utils/mail.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userModel: any;
  let jwtService: JwtService;

  const mockUser = {
    _id: 'user123',
    email: 'test@example.com',
    password: 'hashedPassword',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    isEmailVerified: false,
    save: jest.fn().mockResolvedValue(this),
    toObject: jest.fn().mockReturnValue({
      _id: 'user123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'user',
    }),
  };

  const mockVetUser = {
    _id: 'vet123',
    email: 'vet@example.com',
    password: 'hashedPassword',
    firstName: 'Dr. Sarah',
    lastName: 'Johnson',
    role: 'vet',
    isEmailVerified: false,
    save: jest.fn().mockResolvedValue(this),
    toObject: jest.fn().mockReturnValue({
      _id: 'vet123',
      email: 'vet@example.com',
      firstName: 'Dr. Sarah',
      lastName: 'Johnson',
      role: 'vet',
    }),
  };

  const mockUserModel: any = jest.fn().mockImplementation((dto) => ({
    ...dto,
    save: jest.fn().mockResolvedValue({ ...dto, _id: 'user123' }),
  }));
  
  mockUserModel.findOne = jest.fn();
  mockUserModel.findById = jest.fn();
  mockUserModel.findByIdAndUpdate = jest.fn();

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
  };

  const mockMailService = {
    sendResetPassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userModel = module.get(getModelToken(User.name));
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user with default role', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'Password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      mockUserModel.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      const newUser = {
        ...mockUser,
        save: jest.fn().mockResolvedValue(mockUser),
      };

      userModel.prototype = newUser;
      jest.spyOn(userModel, 'constructor' as any).mockReturnValue(newUser);

      const result = await service.register(registerDto);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: registerDto.email });
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 12);
      expect(result).toHaveProperty('access_token');
      expect(result.user.role).toBe('user');
    });

    it('should register a new vet user', async () => {
      const registerDto = {
        email: 'vet@example.com',
        password: 'VetPass123',
        firstName: 'Dr. Sarah',
        lastName: 'Johnson',
        role: 'vet',
      };

      mockUserModel.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      const newVet = {
        ...mockVetUser,
        save: jest.fn().mockResolvedValue(mockVetUser),
      };

      userModel.prototype = newVet;
      jest.spyOn(userModel, 'constructor' as any).mockReturnValue(newVet);

      const result = await service.register(registerDto);

      expect(result.user.role).toBe('vet');
      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({ role: 'vet' }),
      );
    });

    it('should throw ConflictException if email exists', async () => {
      const registerDto = {
        email: 'existing@example.com',
        password: 'Password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      mockUserModel.findOne.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login user and return token with role', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'Password123',
      };

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockUserModel.findOne.mockResolvedValue(mockUser);
      mockUserModel.findByIdAndUpdate.mockResolvedValue(mockUser);

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('access_token');
      expect(result.user.role).toBe('user');
      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          email: loginDto.email,
          sub: mockUser._id,
          role: 'user',
        }),
      );
    });

    it('should login vet and return token with vet role', async () => {
      const loginDto = {
        email: 'vet@example.com',
        password: 'VetPass123',
      };

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockUserModel.findOne.mockResolvedValue(mockVetUser);
      mockUserModel.findByIdAndUpdate.mockResolvedValue(mockVetUser);

      const result = await service.login(loginDto);

      expect(result.user.role).toBe('vet');
      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          role: 'vet',
        }),
      );
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'WrongPassword',
      };

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      mockUserModel.findOne.mockResolvedValue(mockUser);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateUser', () => {
    it('should validate user credentials', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockUserModel.findOne.mockResolvedValue(mockUser);

      const result = await service.validateUser('test@example.com', 'Password123');

      expect(result).toBeDefined();
      expect(result.email).toBe('test@example.com');
    });

    it('should return null for invalid credentials', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      mockUserModel.findOne.mockResolvedValue(mockUser);

      const result = await service.validateUser('test@example.com', 'WrongPassword');

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      const userId = new Types.ObjectId().toString();
      const userWithId = { ...mockUser, _id: userId };
      mockUserModel.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(userWithId),
      });

      const result = await service.findById(userId);

      expect(mockUserModel.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(userWithId);
    });
  });
});
