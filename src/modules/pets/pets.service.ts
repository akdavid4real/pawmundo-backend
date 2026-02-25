import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@modules/prisma/prisma.service';
import { HealthStatus } from '@prisma/client';

@Injectable()
export class PetsService {
  constructor(private prisma: PrismaService) { }

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
}