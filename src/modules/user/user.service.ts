import { Injectable } from '@nestjs/common';
import { PrismaService } from '@modules/prisma/prisma.service';
import { SupabaseStorageService, STORAGE_BUCKETS } from '../supabase/supabase-storage.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly storageService: SupabaseStorageService,
  ) { }

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

    const { profileImage, phone, address, ...rest } = user as any;

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
      avatar: profileImage,
      phoneNumber: phone,
      address: formattedAddress,
    };
  }

  async updateProfile(id: string, updateData: any) {
    const { avatar, phoneNumber, phone, address, ...rest } = updateData;

    let finalAddress = address;
    if (address && typeof address === 'object') {
      finalAddress = JSON.stringify(address);
    }

    const dataSafely: any = {
      ...rest,
    };

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

    const { profileImage: mappedAvatar, phone: mappedPhone, address: savedAddress, ...restResult } = updatedUser as any;

    let formattedAddress = savedAddress;
    if (savedAddress) {
      try {
        const parsed = JSON.parse(savedAddress);
        if (typeof parsed === 'object') {
          formattedAddress = parsed;
        }
      } catch (e) {
        // Fallback to string
      }
    }

    return {
      ...restResult,
      avatar: mappedAvatar,
      phoneNumber: mappedPhone,
      address: formattedAddress,
    };
  }
}