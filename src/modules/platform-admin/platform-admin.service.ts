import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  ClinicMembershipRole,
  ClinicMembershipStatus,
  ClinicVerificationStatus,
  Prisma,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ListPlatformClinicsDto } from './dto/list-platform-clinics.dto';

@Injectable()
export class PlatformAdminService {
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

  async getClinicStats() {
    const [
      clinicsTotal,
      clinicsPending,
      clinicsApproved,
      clinicsSuspended,
      vetsActive,
      vetsPending,
      clinicAdminsActive,
    ] = await Promise.all([
      this.prisma.clinic.count(),
      this.prisma.clinic.count({ where: { verificationStatus: ClinicVerificationStatus.pending } }),
      this.prisma.clinic.count({ where: { verificationStatus: ClinicVerificationStatus.approved, isActive: true } }),
      this.prisma.clinic.count({ where: { isActive: false } }),
      this.prisma.clinicMembership.count({
        where: { role: ClinicMembershipRole.vet, status: ClinicMembershipStatus.active },
      }),
      this.prisma.clinicMembership.count({
        where: { role: ClinicMembershipRole.vet, status: ClinicMembershipStatus.pending },
      }),
      this.prisma.clinicMembership.count({
        where: { role: ClinicMembershipRole.clinic_admin, status: ClinicMembershipStatus.active },
      }),
    ]);

    return {
      clinicsTotal,
      clinicsPending,
      clinicsApproved,
      clinicsSuspended,
      vetsActive,
      vetsPending,
      clinicAdminsActive,
    };
  }

  async listClinics(query: ListPlatformClinicsDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 25;
    const trimmed = query.q?.trim();
    const where: Prisma.ClinicWhereInput = {
      ...(query.verificationStatus ? { verificationStatus: query.verificationStatus } : {}),
      ...(query.isActive ? { isActive: query.isActive === 'true' } : {}),
      ...(trimmed
        ? {
            OR: [
              { name: { contains: trimmed, mode: Prisma.QueryMode.insensitive } },
              { email: { contains: trimmed, mode: Prisma.QueryMode.insensitive } },
              { phone: { contains: trimmed, mode: Prisma.QueryMode.insensitive } },
              { address: { contains: trimmed, mode: Prisma.QueryMode.insensitive } },
              { registrationNumber: { contains: trimmed, mode: Prisma.QueryMode.insensitive } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.clinic.findMany({
        where,
        include: {
          memberships: {
            where: { status: { not: ClinicMembershipStatus.removed } },
            include: {
              user: {
                select: { id: true, email: true, firstName: true, lastName: true, role: true, phone: true },
              },
            },
            orderBy: [{ role: 'asc' }, { status: 'asc' }, { createdAt: 'desc' }],
          },
          _count: {
            select: {
              appointments: true,
              consultations: true,
              memberships: true,
            },
          },
        },
        orderBy: [{ verificationStatus: 'asc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.clinic.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async listPendingClinics() {
    return this.prisma.clinic.findMany({
      where: { verificationStatus: ClinicVerificationStatus.pending, isActive: true },
      include: this.clinicInclude,
      orderBy: { createdAt: 'asc' },
    });
  }

  async getClinic(clinicId: string) {
    const clinic = await this.prisma.clinic.findUnique({
      where: { id: clinicId },
      include: {
        memberships: {
          include: {
            user: { select: { id: true, email: true, firstName: true, lastName: true, role: true, phone: true } },
            invitedBy: { select: { id: true, email: true, firstName: true, lastName: true } },
            approvedBy: { select: { id: true, email: true, firstName: true, lastName: true } },
          },
          orderBy: [{ role: 'asc' }, { status: 'asc' }, { createdAt: 'desc' }],
        },
        appointments: {
          select: { id: true, userId: true, petId: true, appointmentDate: true, status: true, createdAt: true },
          orderBy: { appointmentDate: 'desc' },
          take: 20,
        },
        consultations: {
          select: { id: true, userId: true, petId: true, assignedVetId: true, status: true, scheduledDate: true, createdAt: true },
          orderBy: { scheduledDate: 'desc' },
          take: 20,
        },
        _count: {
          select: {
            appointments: true,
            consultations: true,
            memberships: true,
          },
        },
      },
    });

    if (!clinic) throw new NotFoundException('Clinic not found');
    return clinic;
  }

  async listClinicMemberships(clinicId: string) {
    await this.ensureClinicExists(clinicId);

    return this.prisma.clinicMembership.findMany({
      where: { clinicId },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true, role: true, phone: true } },
        invitedBy: { select: { id: true, email: true, firstName: true, lastName: true } },
        approvedBy: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
      orderBy: [{ role: 'asc' }, { status: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async approveClinic(clinicId: string, adminId: string) {
    await this.ensureClinicExists(clinicId);

    return this.prisma.$transaction(async tx => {
      const updatedClinic = await tx.clinic.update({
        where: { id: clinicId },
        data: {
          verificationStatus: ClinicVerificationStatus.approved,
          rejectionReason: null,
          isActive: true,
        },
      });

      await tx.clinicMembership.updateMany({
        where: { clinicId, role: ClinicMembershipRole.clinic_admin, status: ClinicMembershipStatus.pending },
        data: {
          status: ClinicMembershipStatus.active,
          approvedById: adminId,
          approvedAt: new Date(),
        },
      });

      return updatedClinic;
    });
  }

  async rejectClinic(clinicId: string, reason?: string) {
    await this.ensureClinicExists(clinicId);

    await this.prisma.clinicMembership.updateMany({
      where: { clinicId, status: ClinicMembershipStatus.pending },
      data: { status: ClinicMembershipStatus.suspended },
    });

    return this.prisma.clinic.update({
      where: { id: clinicId },
      data: {
        verificationStatus: ClinicVerificationStatus.rejected,
        rejectionReason: reason,
      },
    });
  }

  async suspendClinic(clinicId: string, reason?: string) {
    await this.ensureClinicExists(clinicId);

    return this.prisma.clinic.update({
      where: { id: clinicId },
      data: {
        isActive: false,
        rejectionReason: reason,
      },
      include: this.clinicInclude,
    });
  }

  async reactivateClinic(clinicId: string) {
    const clinic = await this.ensureClinicExists(clinicId);

    if (clinic.verificationStatus !== ClinicVerificationStatus.approved) {
      throw new BadRequestException('Only approved clinics can be reactivated');
    }

    return this.prisma.clinic.update({
      where: { id: clinicId },
      data: {
        isActive: true,
        rejectionReason: null,
      },
      include: this.clinicInclude,
    });
  }

  private async ensureClinicExists(clinicId: string) {
    const clinic = await this.prisma.clinic.findUnique({ where: { id: clinicId } });
    if (!clinic) throw new NotFoundException('Clinic not found');
    return clinic;
  }
}
