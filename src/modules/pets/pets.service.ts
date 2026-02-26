import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@modules/prisma/prisma.service';
import { HealthStatus } from '@prisma/client';
import { SupabaseStorageService, STORAGE_BUCKETS } from '../supabase/supabase-storage.service';

@Injectable()
export class PetsService {
  constructor(
    private prisma: PrismaService,
    private readonly storageService: SupabaseStorageService,
  ) { }

  async create(petData: any) {
    return this.prisma.pet.create({ data: petData });
  }

  async findByOwner(ownerId: string, species?: string) {
    return this.prisma.pet.findMany({
      where: {
        ownerId,
        isActive: true,
        ...(species ? { species } : {}),
      },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string, ownerId?: string) {
    const pet = await this.prisma.pet.findUnique({ where: { id } });
    if (!pet || !pet.isActive) {
      throw new NotFoundException(`Pet with ID '${id}' does not exist`);
    }
    if (ownerId && pet.ownerId !== ownerId) {
      throw new ForbiddenException(`Access denied`);
    }
    return pet;
  }

  async update(id: string, ownerId: string, updateData: any) {
    await this.findById(id, ownerId);
    return this.prisma.pet.update({ where: { id }, data: updateData });
  }

  async delete(id: string, ownerId: string) {
    await this.findById(id, ownerId);
    return this.prisma.pet.update({ where: { id }, data: { isActive: false } });
  }

  async updateHealthStatus(id: string, ownerId: string, status: string) {
    await this.findById(id, ownerId);
    const validStatuses = ['healthy', 'sick', 'recovering', 'chronic'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException(`Invalid health status '${status}'. Valid options are: ${validStatuses.join(', ')}`);
    }
    return this.prisma.pet.update({
      where: { id },
      data: { healthStatus: status as HealthStatus },
    });
  }

  async findByHealthStatus(ownerId: string, status: string) {
    return this.prisma.pet.findMany({
      where: { ownerId, healthStatus: status as HealthStatus, isActive: true },
    });
  }

  async findByName(ownerId: string, name: string) {
    return this.prisma.pet.findFirst({
      where: {
        ownerId,
        name: { contains: name, mode: 'insensitive' },
        isActive: true,
      },
    });
  }

  // ── Profile Image ────────────────────────────────

  async uploadProfileImage(petId: string, ownerId: string, file: Buffer, mimetype: string) {
    await this.findById(petId, ownerId);

    const fileExt = mimetype.split('/')[1] || 'png';
    const filePath = `${petId}/profile_${Date.now()}.${fileExt}`;

    const publicUrl = await this.storageService.uploadFile(
      STORAGE_BUCKETS.PET_IMAGES.name,
      filePath,
      file,
      mimetype,
    );

    return this.prisma.pet.update({
      where: { id: petId },
      data: { profileImage: publicUrl },
    });
  }

  // ── Photo Management ─────────────────────────────

  async uploadPhoto(petId: string, ownerId: string, file: Buffer, mimetype: string, caption?: string) {
    await this.findById(petId, ownerId);

    const fileExt = mimetype.split('/')[1] || 'png';
    const filePath = `${petId}/${Date.now()}.${fileExt}`;

    const publicUrl = await this.storageService.uploadFile(
      STORAGE_BUCKETS.PET_IMAGES.name,
      filePath,
      file,
      mimetype,
    );

    return this.prisma.petPhoto.create({
      data: { petId, url: publicUrl, caption },
    });
  }

  async getPhotos(petId: string, ownerId: string) {
    await this.findById(petId, ownerId);
    return this.prisma.petPhoto.findMany({
      where: { petId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deletePhoto(photoId: string, ownerId: string) {
    const photo = await this.prisma.petPhoto.findUnique({
      where: { id: photoId },
      include: { pet: true },
    });

    if (!photo) {
      throw new NotFoundException(`Photo not found`);
    }

    if (photo.pet.ownerId !== ownerId) {
      throw new ForbiddenException(`Access denied`);
    }

    // Extract storage path from the public URL
    const urlParts = photo.url.split(`/${STORAGE_BUCKETS.PET_IMAGES.name}/`);
    if (urlParts.length > 1) {
      await this.storageService.deleteFile(STORAGE_BUCKETS.PET_IMAGES.name, urlParts[1]);
    }

    await this.prisma.petPhoto.delete({ where: { id: photoId } });
    return { message: 'Photo deleted successfully' };
  }
}
