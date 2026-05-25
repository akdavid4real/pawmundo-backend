import { Test, TestingModule } from '@nestjs/testing';
import { SupabaseStorageService, STORAGE_BUCKETS } from './supabase-storage.service';
import { SupabaseService } from './supabase.service';
import { BadRequestException } from '@nestjs/common';

describe('SupabaseStorageService', () => {
  let service: SupabaseStorageService;
  let supabaseService: SupabaseService;

  const mockSupabaseClient = {
    storage: {
      getBucket: jest.fn(),
      createBucket: jest.fn(),
      updateBucket: jest.fn(),
      from: jest.fn().mockReturnValue({
        upload: jest.fn(),
        getPublicUrl: jest.fn(),
        createSignedUrl: jest.fn(),
        remove: jest.fn(),
      }),
    },
  };

  const mockSupabaseService = {
    getClient: jest.fn().mockReturnValue(mockSupabaseClient),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupabaseStorageService,
        { provide: SupabaseService, useValue: mockSupabaseService },
      ],
    }).compile();

    service = module.get<SupabaseStorageService>(SupabaseStorageService);
    supabaseService = module.get<SupabaseService>(SupabaseService);

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('ensureBuckets', () => {
    it('should create buckets if they do not exist', async () => {
      mockSupabaseClient.storage.getBucket.mockResolvedValue({ data: null, error: { message: 'Not found' } });
      mockSupabaseClient.storage.createBucket.mockResolvedValue({ data: { name: 'bucket' }, error: null });

      await service.ensureBuckets();

      expect(mockSupabaseClient.storage.getBucket).toHaveBeenCalledTimes(Object.keys(STORAGE_BUCKETS).length);
      expect(mockSupabaseClient.storage.createBucket).toHaveBeenCalledTimes(Object.keys(STORAGE_BUCKETS).length);
    });

    it('should not create buckets if they already exist', async () => {
      mockSupabaseClient.storage.getBucket.mockResolvedValue({ data: { name: 'bucket' }, error: null });
      mockSupabaseClient.storage.updateBucket.mockResolvedValue({ data: { name: 'bucket' }, error: null });

      await service.ensureBuckets();

      expect(mockSupabaseClient.storage.getBucket).toHaveBeenCalledTimes(Object.keys(STORAGE_BUCKETS).length);
      expect(mockSupabaseClient.storage.createBucket).not.toHaveBeenCalled();
      expect(mockSupabaseClient.storage.updateBucket).toHaveBeenCalledTimes(Object.keys(STORAGE_BUCKETS).length);
    });
  });

  describe('uploadFile', () => {
    const bucketName = STORAGE_BUCKETS.PROFILE_AVATARS.name;
    const filePath = 'test/file.png';
    const file = Buffer.alloc(1024); // 1KB
    const contentType = 'image/png';

    it('should throw if bucket is unknown', async () => {
      await expect(service.uploadFile('unknown-bucket', filePath, file, contentType))
        .rejects.toThrow(BadRequestException);
    });

    it('should throw if mime type is not allowed', async () => {
      await expect(service.uploadFile(bucketName, filePath, file, 'application/pdf'))
        .rejects.toThrow(BadRequestException);
    });

    it('should throw if file size exceeds limit', async () => {
      const largeFile = Buffer.alloc(10 * 1024 * 1024); // 10MB, limit is 5MB for profile-avatars
      await expect(service.uploadFile(bucketName, filePath, largeFile, contentType))
        .rejects.toThrow(BadRequestException);
    });

    it('should upload file successfully', async () => {
      const mockUpload = jest.fn().mockResolvedValue({ data: { path: filePath }, error: null });
      const mockGetPublicUrl = jest.fn().mockReturnValue({ data: { publicUrl: 'http://public.url' } });

      mockSupabaseClient.storage.from.mockReturnValue({
        upload: mockUpload,
        getPublicUrl: mockGetPublicUrl,
      });

      const url = await service.uploadFile(bucketName, filePath, file, contentType);

      expect(mockSupabaseClient.storage.from).toHaveBeenCalledWith(bucketName);
      expect(mockUpload).toHaveBeenCalledWith(filePath, file, { contentType, upsert: true });
      expect(url).toBe('http://public.url');
    });

    it('should throw if upload fails', async () => {
      const mockUpload = jest.fn().mockResolvedValue({ data: null, error: { message: 'Upload error' } });
      mockSupabaseClient.storage.from.mockReturnValue({ upload: mockUpload });

      await expect(service.uploadFile(bucketName, filePath, file, contentType))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('getSignedUrl', () => {
    const bucketName = STORAGE_BUCKETS.HEALTH_ATTACHMENTS.name;
    const filePath = 'test/file.pdf';

    it('should return signed url', async () => {
      const mockCreateSignedUrl = jest.fn().mockResolvedValue({ data: { signedUrl: 'http://signed.url' }, error: null });
      mockSupabaseClient.storage.from.mockReturnValue({ createSignedUrl: mockCreateSignedUrl });

      const url = await service.getSignedUrl(bucketName, filePath);

      expect(mockSupabaseClient.storage.from).toHaveBeenCalledWith(bucketName);
      expect(mockCreateSignedUrl).toHaveBeenCalledWith(filePath, 3600);
      expect(url).toBe('http://signed.url');
    });

    it('should throw if signed url generation fails', async () => {
      const mockCreateSignedUrl = jest.fn().mockResolvedValue({ data: null, error: { message: 'Error' } });
      mockSupabaseClient.storage.from.mockReturnValue({ createSignedUrl: mockCreateSignedUrl });

      await expect(service.getSignedUrl(bucketName, filePath)).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteFile', () => {
    it('should call remove with array of one filepath', async () => {
      const mockRemove = jest.fn().mockResolvedValue({ data: {}, error: null });
      mockSupabaseClient.storage.from.mockReturnValue({ remove: mockRemove });

      await service.deleteFile('bucket', 'path/to/file');

      expect(mockSupabaseClient.storage.from).toHaveBeenCalledWith('bucket');
      expect(mockRemove).toHaveBeenCalledWith(['path/to/file']);
    });
  });

  describe('deleteFiles', () => {
    it('should do nothing if file paths array is empty', async () => {
      const mockRemove = jest.fn();
      mockSupabaseClient.storage.from.mockReturnValue({ remove: mockRemove });

      await service.deleteFiles('bucket', []);

      expect(mockRemove).not.toHaveBeenCalled();
    });

    it('should call remove with file paths array', async () => {
      const mockRemove = jest.fn().mockResolvedValue({ data: {}, error: null });
      mockSupabaseClient.storage.from.mockReturnValue({ remove: mockRemove });

      await service.deleteFiles('bucket', ['path1', 'path2']);

      expect(mockSupabaseClient.storage.from).toHaveBeenCalledWith('bucket');
      expect(mockRemove).toHaveBeenCalledWith(['path1', 'path2']);
    });
  });
});
