import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  ClinicMembershipRole,
  ClinicMembershipStatus,
  ClinicVerificationStatus,
  Prisma,
  UserRole,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterClinicDto } from './dto/register-clinic.dto';
import { CreateClinicVetDto } from './dto/create-clinic-vet.dto';

@Injectable()
export class ClinicsService {
  constructor(private prisma: PrismaService) {}

  private readonly clinicInclude = {
    memberships: {
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true, role: true, phone: true },
        },
      },
    },
  };

  async search(query?: string) {
    const trimmed = query?.trim();

    return this.prisma.clinic.findMany({
      where: {
        isActive: true,
        verificationStatus: ClinicVerificationStatus.approved,
        ...(trimmed
          ? {
              OR: [
                { name: { contains: trimmed, mode: Prisma.QueryMode.insensitive } },
                { address: { contains: trimmed, mode: Prisma.QueryMode.insensitive } },
              ],
            }
          : {}),
      },
      select: { id: true, name: true, email: true, phone: true, address: true },
      orderBy: { name: 'asc' },
      take: 25,
    });
  }

  async registerClinic(dto: RegisterClinicDto) {
    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.adminEmail } });
    if (existingUser) {
      throw new ConflictException(`An account with email '${dto.adminEmail}' already exists`);
    }

    const hashedPassword = await bcrypt.hash(dto.adminPassword, 12);

    const result = await this.prisma.$transaction(async tx => {
      const user = await tx.user.create({
        data: {
          email: dto.adminEmail,
          password: hashedPassword,
          firstName: dto.adminFirstName,
          lastName: dto.adminLastName,
          role: UserRole.clinic_admin,
          phone: dto.adminPhone,
        },
      });

      const clinic = await tx.clinic.create({
        data: {
          name: dto.name,
          email: dto.email,
          phone: dto.phone,
          address: dto.address,
          registrationNumber: dto.registrationNumber,
          verificationDocuments: dto.verificationDocuments ?? [],
          verificationStatus: ClinicVerificationStatus.pending,
          memberships: {
            create: {
              userId: user.id,
              role: ClinicMembershipRole.clinic_admin,
              status: ClinicMembershipStatus.pending,
            },
          },
        },
        include: this.clinicInclude,
      });

      return { user, clinic };
    });

    return {
      message: 'Clinic submitted for review. The clinic admin account can access clinic tools after approval.',
      clinic: result.clinic,
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        role: result.user.role,
      },
    };
  }

  async requestVetMembership(userId: string, clinicId: string) {
    const clinic = await this.prisma.clinic.findFirst({
      where: { id: clinicId, isActive: true, verificationStatus: ClinicVerificationStatus.approved },
    });
    if (!clinic) {
      throw new NotFoundException('Clinic not found or not approved yet');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (user.role !== UserRole.vet) {
      throw new BadRequestException('Only vet accounts can request clinic membership');
    }

    return this.prisma.clinicMembership.upsert({
      where: { clinicId_userId: { clinicId, userId } },
      create: {
        clinicId,
        userId,
        role: ClinicMembershipRole.vet,
        status: ClinicMembershipStatus.pending,
      },
      update: {
        status: ClinicMembershipStatus.pending,
        role: ClinicMembershipRole.vet,
        removedAt: null,
      },
      include: { clinic: true },
    });
  }

  async getMyClinicContext(userId: string) {
    const memberships = await this.prisma.clinicMembership.findMany({
      where: { userId, status: { not: ClinicMembershipStatus.removed } },
      include: { clinic: true },
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    });

    return { memberships };
  }

  async getActiveClinicForUser(userId: string, roles?: ClinicMembershipRole[]) {
    return this.prisma.clinicMembership.findFirst({
      where: {
        userId,
        status: ClinicMembershipStatus.active,
        ...(roles ? { role: { in: roles } } : {}),
        clinic: { isActive: true, verificationStatus: ClinicVerificationStatus.approved },
      },
      include: { clinic: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async requireClinicAdmin(userId: string) {
    const membership = await this.getActiveClinicForUser(userId, [ClinicMembershipRole.clinic_admin]);
    if (!membership) {
      throw new ForbiddenException('Active clinic admin membership is required');
    }
    return membership;
  }

  async requireVetClinicAccess(userId: string, clinicId?: string | null) {
    if (!clinicId) return null;

    const membership = await this.prisma.clinicMembership.findFirst({
      where: {
        userId,
        clinicId,
        status: ClinicMembershipStatus.active,
        role: { in: [ClinicMembershipRole.vet, ClinicMembershipRole.clinic_admin] },
        clinic: { isActive: true, verificationStatus: ClinicVerificationStatus.approved },
      },
    });

    if (!membership) {
      throw new ForbiddenException('You do not have access to this clinic');
    }

    return membership;
  }

  async findApprovedClinicOrThrow(clinicId: string) {
    const clinic = await this.prisma.clinic.findFirst({
      where: { id: clinicId, isActive: true, verificationStatus: ClinicVerificationStatus.approved },
    });
    if (!clinic) {
      throw new NotFoundException('Clinic not found or not approved yet');
    }
    return clinic;
  }

  async getAdminDashboard(userId: string) {
    const membership = await this.requireClinicAdmin(userId);
    const clinicId = membership.clinicId;

    const [vetsTotal, vetsPending, appointmentsTotal, consultationsTotal, consultationPatients, appointmentPatients] =
      await Promise.all([
        this.prisma.clinicMembership.count({
          where: { clinicId, role: ClinicMembershipRole.vet, status: ClinicMembershipStatus.active },
        }),
        this.prisma.clinicMembership.count({
          where: { clinicId, role: ClinicMembershipRole.vet, status: ClinicMembershipStatus.pending },
        }),
        this.prisma.appointment.count({ where: { clinicId, isActive: true } }),
        this.prisma.consultation.count({ where: { clinicId, isActive: true } }),
        this.prisma.consultation.findMany({
          where: { clinicId, isActive: true },
          distinct: ['userId'],
          select: { userId: true },
        }),
        this.prisma.appointment.findMany({
          where: { clinicId, isActive: true },
          distinct: ['userId'],
          select: { userId: true },
        }),
      ]);

    const patientIds = new Set([
      ...consultationPatients.map(patient => patient.userId),
      ...appointmentPatients.map(patient => patient.userId),
    ]);

    return {
      clinic: membership.clinic,
      stats: {
        vetsTotal,
        vetsPending,
        appointmentsTotal,
        consultationsTotal,
        patientCount: patientIds.size,
      },
    };
  }

  async listClinicVets(userId: string) {
    const membership = await this.requireClinicAdmin(userId);

    return this.prisma.clinicMembership.findMany({
      where: {
        clinicId: membership.clinicId,
        role: ClinicMembershipRole.vet,
        status: { not: ClinicMembershipStatus.removed },
      },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true, role: true } },
      },
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async createClinicVet(userId: string, dto: CreateClinicVetDto) {
    const adminMembership = await this.requireClinicAdmin(userId);
    const password = dto.password ?? `Temp${Math.random().toString(36).slice(2, 10)}1A`;
    const hashedPassword = await bcrypt.hash(password, 12);

    return this.prisma.$transaction(async tx => {
      const user = await tx.user.upsert({
        where: { email: dto.email },
        create: {
          email: dto.email,
          password: hashedPassword,
          firstName: dto.firstName,
          lastName: dto.lastName,
          phone: dto.phone,
          role: UserRole.vet,
        },
        update: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          phone: dto.phone,
          role: UserRole.vet,
        },
      });

      const membership = await tx.clinicMembership.upsert({
        where: { clinicId_userId: { clinicId: adminMembership.clinicId, userId: user.id } },
        create: {
          clinicId: adminMembership.clinicId,
          userId: user.id,
          role: ClinicMembershipRole.vet,
          status: ClinicMembershipStatus.active,
          invitedById: userId,
          approvedById: userId,
          approvedAt: new Date(),
        },
        update: {
          role: ClinicMembershipRole.vet,
          status: ClinicMembershipStatus.active,
          removedAt: null,
          approvedById: userId,
          approvedAt: new Date(),
        },
        include: {
          user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true, role: true } },
          clinic: true,
        },
      });

      return {
        membership,
        temporaryPassword: dto.password ? undefined : password,
      };
    });
  }

  async approveVet(userId: string, membershipId: string) {
    const adminMembership = await this.requireClinicAdmin(userId);

    return this.updateVetMembershipStatus(
      adminMembership.clinicId,
      membershipId,
      ClinicMembershipStatus.active,
      userId,
    );
  }

  async suspendVet(userId: string, membershipId: string) {
    const adminMembership = await this.requireClinicAdmin(userId);

    return this.updateVetMembershipStatus(
      adminMembership.clinicId,
      membershipId,
      ClinicMembershipStatus.suspended,
      userId,
    );
  }

  async removeVet(userId: string, membershipId: string) {
    const adminMembership = await this.requireClinicAdmin(userId);

    return this.updateVetMembershipStatus(
      adminMembership.clinicId,
      membershipId,
      ClinicMembershipStatus.removed,
      userId,
      { removedAt: new Date() },
    );
  }

  private async updateVetMembershipStatus(
    clinicId: string,
    membershipId: string,
    status: ClinicMembershipStatus,
    actorId: string,
    extraData: Prisma.ClinicMembershipUncheckedUpdateInput = {},
  ) {
    const membership = await this.prisma.clinicMembership.findFirst({
      where: { id: membershipId, clinicId, role: ClinicMembershipRole.vet },
    });
    if (!membership) {
      throw new NotFoundException('Vet membership not found');
    }

    return this.prisma.clinicMembership.update({
      where: { id: membershipId },
      data: {
        status,
        approvedById: status === ClinicMembershipStatus.active ? actorId : membership.approvedById,
        approvedAt: status === ClinicMembershipStatus.active ? new Date() : membership.approvedAt,
        ...extraData,
      },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true, role: true } },
        clinic: true,
      },
    });
  }

}
