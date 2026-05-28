import { Injectable } from '@nestjs/common';
import { ConsultationStatus, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseStorageService, STORAGE_BUCKETS } from '../supabase/supabase-storage.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly storageService: SupabaseStorageService,
  ) { }

  private readonly editableProfileFields = [
    'firstName',
    'lastName',
    'licenseNumber',
    'specialization',
    'bio',
    'yearsOfExperience',
  ];

  private async getVetStats(id: string) {
    const [totalConsultations, activeCases] = await Promise.all([
      this.prisma.consultation.count({
        where: { assignedVetId: id, status: ConsultationStatus.completed, isActive: true },
      }),
      this.prisma.consultation.count({
        where: {
          assignedVetId: id,
          status: { in: [ConsultationStatus.assigned, ConsultationStatus.in_progress] },
          isActive: true,
        },
      }),
    ]);

    return {
      totalConsultations,
      activeCases,
      rating: null,
    };
  }

  private async formatUserProfile(user: any) {
    if (!user) return null;

    const { profileImage, phone, address, role, ...rest } = user as any;

    let formattedAddress = address;
    if (address) {
      try {
        const parsed = JSON.parse(address);
        if (typeof parsed === 'object') {
          formattedAddress = parsed;
        }
      } catch (e) {
        // Fallback to original string
      }
    }

    return {
      ...rest,
      role,
      avatar: profileImage,
      phoneNumber: phone,
      address: formattedAddress,
      professionalVerificationStatus:
        rest.professionalVerificationStatus || (role === UserRole.vet ? 'unverified' : undefined),
      stats: role === UserRole.vet ? await this.getVetStats(user.id) : undefined,
    };
  }

  async uploadAvatar(id: string, file: Buffer, mimetype: string): Promise<string> {
    const fileExt = mimetype.split('/')[1] || 'png';
    const filePath = `${id}/avatar_${Date.now()}.${fileExt}`;

    const publicUrl = await this.storageService.uploadFile(
      STORAGE_BUCKETS.PROFILE_AVATARS.name,
      filePath,
      file,
      mimetype,
    );

    // Update user profile with new avatar URL
    await this.updateProfile(id, { avatar: publicUrl });

    return publicUrl;
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });

    if (!user) return null;

    return this.formatUserProfile(user);
  }

  async updateProfile(id: string, updateData: any) {
    const { avatar, phoneNumber, phone, address, ...rest } = updateData;

    let finalAddress = address;
    if (address && typeof address === 'object') {
      finalAddress = JSON.stringify(address);
    }

    const dataSafely: any = {};

    for (const field of this.editableProfileFields) {
      if (Object.prototype.hasOwnProperty.call(rest, field)) {
        dataSafely[field] = field === 'yearsOfExperience' && rest[field] !== undefined && rest[field] !== null
          ? Number(rest[field])
          : rest[field];
      }
    }

    if (phoneNumber || phone) {
      dataSafely.phone = phoneNumber || phone;
    }

    if (avatar) {
      dataSafely.profileImage = avatar;
    }

    if (finalAddress) {
      dataSafely.address = finalAddress;
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: dataSafely,
      omit: { password: true },
    });

    return this.formatUserProfile(updatedUser);
  }
}
