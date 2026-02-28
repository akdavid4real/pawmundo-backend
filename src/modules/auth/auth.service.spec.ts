import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../../common/utils/mail.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const mockUser = {
    id: 'user-uuid-123',
    email: 'test@example.com',
    password: 'hashedPassword',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    isEmailVerified: false,
  };

  const mockVetUser = {
    id: 'vet-uuid-123',
    email: 'vet@example.com',
    password: 'hashedPassword',
    firstName: 'Dr. Sarah',
    lastName: 'Johnson',
    role: 'vet',
    isEmailVerified: false,
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

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
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
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

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await service.register(registerDto as any);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({ where: { email: registerDto.email } });
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

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockPrismaService.user.create.mockResolvedValue(mockVetUser);

      const result = await service.register(registerDto as any);

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

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.register(registerDto as any)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login user and return token with role', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'Password123',
      };

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue(mockUser);

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('access_token');
      expect(result.user.role).toBe('user');
      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          email: loginDto.email,
          sub: mockUser.id,
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
      mockPrismaService.user.findUnique.mockResolvedValue(mockVetUser);
      mockPrismaService.user.update.mockResolvedValue(mockVetUser);

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
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateUser', () => {
    it('should validate user credentials', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.validateUser('test@example.com', 'Password123');

      expect(result).toBeDefined();
      expect(result.email).toBe('test@example.com');
    });

    it('should return null for invalid credentials', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.validateUser('test@example.com', 'WrongPassword');

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findById('user-uuid-123');

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-uuid-123' },
        omit: {
          password: true,
          emailVerificationToken: true,
          passwordResetToken: true,
        },
      });
      expect(result).toEqual(mockUser);
    });
  });
});