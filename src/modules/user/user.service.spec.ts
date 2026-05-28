import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseStorageService, STORAGE_BUCKETS } from '../supabase/supabase-storage.service';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;
  let supabaseStorageService: SupabaseStorageService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    consultation: {
      count: jest.fn(),
    },
  };

  const mockSupabaseStorageService = {
    uploadFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: SupabaseStorageService, useValue: mockSupabaseStorageService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
    supabaseStorageService = module.get<SupabaseStorageService>(SupabaseStorageService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should return null if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      const result = await service.findById('non-existent-id');
      expect(result).toBeNull();
    });

    it('should return formatted user profile', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-id',
        email: 'test@example.com',
        profileImage: 'http://avatar.url',
        phone: '1234567890',
        address: '{"city":"Testville"}',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
      });

      const result = await service.findById('user-id');
      expect(result).toEqual({
        id: 'user-id',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        avatar: 'http://avatar.url',
        phoneNumber: '1234567890',
        address: { city: 'Testville' },
        professionalVerificationStatus: undefined,
        stats: undefined,
      });
    });

    it('should return backend-backed vet professional fields and stats', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'vet-id',
        email: 'vet@example.com',
        firstName: 'Ada',
        lastName: 'Vet',
        role: 'vet',
        profileImage: null,
        phone: null,
        address: null,
        licenseNumber: 'VET-123',
        specialization: 'Dermatology',
        bio: 'Small animal care',
        yearsOfExperience: 7,
        professionalVerificationStatus: 'pending',
      });
      mockPrismaService.consultation.count
        .mockResolvedValueOnce(12)
        .mockResolvedValueOnce(2);

      const result = await service.findById('vet-id');

      expect(result).toEqual(expect.objectContaining({
        id: 'vet-id',
        role: 'vet',
        licenseNumber: 'VET-123',
        specialization: 'Dermatology',
        bio: 'Small animal care',
        yearsOfExperience: 7,
        professionalVerificationStatus: 'pending',
        stats: {
          totalConsultations: 12,
          activeCases: 2,
          rating: null,
        },
      }));
    });

    it('should handle invalid JSON address gracefully', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-id',
        address: 'invalid-json',
        role: 'user',
      });

      const result = await service.findById('user-id');
      expect(result).toEqual({
        id: 'user-id',
        role: 'user',
        avatar: undefined,
        phoneNumber: undefined,
        address: 'invalid-json',
        professionalVerificationStatus: undefined,
        stats: undefined,
      });
    });
  });

  describe('uploadAvatar', () => {
    it('should upload file and update user profile', async () => {
      const buffer = Buffer.from('test');
      const publicUrl = 'http://public.url/avatar.png';
      mockSupabaseStorageService.uploadFile.mockResolvedValue(publicUrl);
      mockPrismaService.user.update.mockResolvedValue({
        id: 'user-id',
        profileImage: publicUrl,
      });

      // We spy on updateProfile to avoid testing its logic here
      const updateProfileSpy = jest.spyOn(service, 'updateProfile').mockResolvedValue(null as any);

      const result = await service.uploadAvatar('user-id', buffer, 'image/png');

      expect(mockSupabaseStorageService.uploadFile).toHaveBeenCalledWith(
        STORAGE_BUCKETS.PROFILE_AVATARS.name,
        expect.stringMatching(/^user-id\/avatar_\d+\.png$/),
        buffer,
        'image/png'
      );
      expect(updateProfileSpy).toHaveBeenCalledWith('user-id', { avatar: publicUrl });
      expect(result).toBe(publicUrl);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile formatting fields correctly', async () => {
      const updateData = {
        avatar: 'http://new.avatar',
        phoneNumber: '0987654321',
        address: { city: 'Newville' },
        firstName: 'Jane',
      };

      mockPrismaService.user.update.mockResolvedValue({
        id: 'user-id',
        firstName: 'Jane',
        profileImage: 'http://new.avatar',
        phone: '0987654321',
        address: '{"city":"Newville"}',
        role: 'user',
      });

      const result = await service.updateProfile('user-id', updateData);

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-id' },
        data: {
          firstName: 'Jane',
          phone: '0987654321',
          profileImage: 'http://new.avatar',
          address: '{"city":"Newville"}',
        },
        omit: { password: true },
      });

      expect(result).toEqual({
        id: 'user-id',
        firstName: 'Jane',
        role: 'user',
        avatar: 'http://new.avatar',
        phoneNumber: '0987654321',
        address: { city: 'Newville' },
        professionalVerificationStatus: undefined,
        stats: undefined,
      });
    });

    it('should persist supported vet professional fields without fake stats', async () => {
      const updateData = {
        licenseNumber: 'VET-456',
        specialization: 'Surgery',
        bio: 'Experienced surgeon',
        yearsOfExperience: '9',
        stats: { totalConsultations: 999 },
      };

      mockPrismaService.user.update.mockResolvedValue({
        id: 'vet-id',
        firstName: 'Ada',
        lastName: 'Vet',
        role: 'vet',
        licenseNumber: 'VET-456',
        specialization: 'Surgery',
        bio: 'Experienced surgeon',
        yearsOfExperience: 9,
        professionalVerificationStatus: null,
      });
      mockPrismaService.consultation.count
        .mockResolvedValueOnce(3)
        .mockResolvedValueOnce(1);

      const result = await service.updateProfile('vet-id', updateData);

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'vet-id' },
        data: {
          licenseNumber: 'VET-456',
          specialization: 'Surgery',
          bio: 'Experienced surgeon',
          yearsOfExperience: 9,
        },
        omit: { password: true },
      });
      expect(result).toEqual(expect.objectContaining({
        licenseNumber: 'VET-456',
        specialization: 'Surgery',
        bio: 'Experienced surgeon',
        yearsOfExperience: 9,
        professionalVerificationStatus: 'unverified',
        stats: {
          totalConsultations: 3,
          activeCases: 1,
          rating: null,
        },
      }));
    });
  });
});
