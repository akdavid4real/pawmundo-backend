import { Injectable, Logger, OnModuleInit, BadRequestException } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

export interface BucketConfig {
    name: string;
    public: boolean;
    maxFileSizeMB: number;
    allowedMimeTypes: string[];
}

export const STORAGE_BUCKETS: Record<string, BucketConfig> = {
    PROFILE_AVATARS: {
        name: 'profile-avatars',
        public: true,
        maxFileSizeMB: 5,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    },
    PET_IMAGES: {
        name: 'pet-images',
        public: true,
        maxFileSizeMB: 10,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    },
    HEALTH_ATTACHMENTS: {
        name: 'health-attachments',
        public: false,
        maxFileSizeMB: 25,
        allowedMimeTypes: [
            'image/jpeg', 'image/png', 'image/webp',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
    },
    PRESCRIPTIONS: {
        name: 'prescriptions',
        public: false,
        maxFileSizeMB: 15,
        allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    },
};

@Injectable()
export class SupabaseStorageService implements OnModuleInit {
    private readonly logger = new Logger(SupabaseStorageService.name);

    constructor(private readonly supabaseService: SupabaseService) { }

    async onModuleInit() {
        await this.ensureBuckets();
    }

    /**
     * Creates required storage buckets if they don't exist and reapplies the
     * expected public/limit/MIME settings when they already do.
     */
    async ensureBuckets(): Promise<void> {
        const client = this.supabaseService.getClient();

        for (const config of Object.values(STORAGE_BUCKETS)) {
            const { data: existing } = await client.storage.getBucket(config.name);
            const bucketOptions = {
                public: config.public,
                fileSizeLimit: config.maxFileSizeMB * 1024 * 1024,
                allowedMimeTypes: config.allowedMimeTypes,
            };

            if (!existing) {
                const { error } = await client.storage.createBucket(config.name, bucketOptions);

                if (error) {
                    this.logger.warn(`Bucket "${config.name}" creation: ${error.message}`);
                } else {
                    this.logger.log(`Created bucket: ${config.name}`);
                }
            } else {
                const { error } = await client.storage.updateBucket(config.name, bucketOptions);
                if (error) {
                    this.logger.warn(`Bucket "${config.name}" update: ${error.message}`);
                }
                this.logger.debug(`Bucket "${config.name}" already exists`);
            }
        }
    }

    /**
     * Upload a file to a specific bucket.
     */
    async uploadFile(
        bucketName: string,
        filePath: string,
        file: Buffer,
        contentType: string,
    ): Promise<string> {
        const bucketConfig = Object.values(STORAGE_BUCKETS).find(b => b.name === bucketName);
        if (!bucketConfig) {
            throw new BadRequestException(`Unknown bucket: ${bucketName}`);
        }

        if (!bucketConfig.allowedMimeTypes.includes(contentType)) {
            throw new BadRequestException(
                `File type "${contentType}" not allowed in "${bucketName}". Allowed: ${bucketConfig.allowedMimeTypes.join(', ')}`,
            );
        }

        const fileSizeMB = file.length / (1024 * 1024);
        if (fileSizeMB > bucketConfig.maxFileSizeMB) {
            throw new BadRequestException(
                `File size ${fileSizeMB.toFixed(1)}MB exceeds ${bucketConfig.maxFileSizeMB}MB limit for "${bucketName}"`,
            );
        }

        const client = this.supabaseService.getClient();
        const { error } = await client.storage
            .from(bucketName)
            .upload(filePath, file, {
                contentType,
                upsert: true,
            });

        if (error) {
            throw new BadRequestException(`Upload failed: ${error.message}`);
        }

        return this.getPublicUrl(bucketName, filePath);
    }

    /**
     * Get a public URL for a file in a public bucket.
     */
    getPublicUrl(bucketName: string, filePath: string): string {
        const client = this.supabaseService.getClient();
        const { data } = client.storage.from(bucketName).getPublicUrl(filePath);
        return data.publicUrl;
    }

    /**
     * Get a signed (temporary) URL for a file in a private bucket.
     */
    async getSignedUrl(bucketName: string, filePath: string, expiresInSeconds = 3600): Promise<string> {
        const client = this.supabaseService.getClient();
        const { data, error } = await client.storage
            .from(bucketName)
            .createSignedUrl(filePath, expiresInSeconds);

        if (error) {
            throw new BadRequestException(`Failed to generate signed URL: ${error.message}`);
        }

        return data.signedUrl;
    }

    /**
     * Delete a file from a bucket.
     */
    async deleteFile(bucketName: string, filePath: string): Promise<void> {
        const client = this.supabaseService.getClient();
        const { error } = await client.storage.from(bucketName).remove([filePath]);

        if (error) {
            this.logger.warn(`Failed to delete "${filePath}" from "${bucketName}": ${error.message}`);
        }
    }

    /**
     * Delete multiple files from a bucket.
     */
    async deleteFiles(bucketName: string, filePaths: string[]): Promise<void> {
        if (filePaths.length === 0) return;

        const client = this.supabaseService.getClient();
        const { error } = await client.storage.from(bucketName).remove(filePaths);

        if (error) {
            this.logger.warn(`Failed to delete files from "${bucketName}": ${error.message}`);
        }
    }
}
