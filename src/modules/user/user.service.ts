import { Injectable } from '@nestjs/common';
import { PrismaService } from '@modules/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });
  }

  async updateProfile(id: string, updateData: any) {
    return this.prisma.user.update({
      where: { id },
      data: updateData,
      omit: { password: true },
    });
  }
}