import { BadRequestException, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import {
  ClinicMembershipRole,
  ClinicMembershipStatus,
  ClinicVerificationStatus,
  UserRole,
} from '@prisma/client';
import { PlatformAdminService } from '../platform-admin/platform-admin.service';
import { ClinicsService } from './clinics.service';

describe('Clinic, vet, and platform admin lifecycle DB-free coverage', () => {
  const clinicId = 'clinic-id';
  const adminId = 'admin-id';
  const vetId = 'vet-id';
  const membershipId = 'membership-id';

  let prisma: any;
  let clinicsService: ClinicsService;
  let platformAdminService: PlatformAdminService;

  beforeEach(() => {
    prisma = {
      user: {
        findUnique: jest.fn(),
      },
      clinic: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      clinicMembership: {
        upsert: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    clinicsService = new ClinicsService(prisma);
    platformAdminService = new PlatformAdminService(prisma);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('searches only active approved clinics and applies optional text filters', async () => {
    prisma.clinic.findMany.mockResolvedValueOnce([{ id: clinicId, name: 'Milo Vet Clinic' }]);

    const result = await clinicsService.search('milo');

    expect(prisma.clinic.findMany).toHaveBeenCalledWith({
      where: expect.objectContaining({
        isActive: true,
        verificationStatus: ClinicVerificationStatus.approved,
        OR: expect.any(Array),
      }),
      select: { id: true, name: true, email: true, phone: true, address: true },
      orderBy: { name: 'asc' },
      take: 25,
    });
    expect(result).toEqual([{ id: clinicId, name: 'Milo Vet Clinic' }]);
  });

  it('rejects clinic registration when the admin account email already exists', async () => {
    prisma.user.findUnique.mockResolvedValueOnce({ id: 'existing-user' });

    await expect(
      clinicsService.registerClinic({
        name: 'Milo Vet Clinic',
        email: 'clinic@example.com',
        adminEmail: 'admin@example.com',
        adminPassword: 'Password123',
        adminFirstName: 'Ada',
        adminLastName: 'Admin',
      } as any),
    ).rejects.toThrow(ConflictException);

    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('allows vet accounts to request membership in an approved active clinic', async () => {
    prisma.clinic.findFirst.mockResolvedValueOnce({ id: clinicId });
    prisma.user.findUnique.mockResolvedValueOnce({ id: vetId, role: UserRole.vet });
    prisma.clinicMembership.upsert.mockResolvedValueOnce({
      id: membershipId,
      clinicId,
      userId: vetId,
      status: ClinicMembershipStatus.pending,
    });

    const result = await clinicsService.requestVetMembership(vetId, clinicId);

    expect(prisma.clinicMembership.upsert).toHaveBeenCalledWith({
      where: { clinicId_userId: { clinicId, userId: vetId } },
      create: {
        clinicId,
        userId: vetId,
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
    expect(result.status).toBe(ClinicMembershipStatus.pending);
  });

  it('rejects non-vet users requesting vet membership', async () => {
    prisma.clinic.findFirst.mockResolvedValueOnce({ id: clinicId });
    prisma.user.findUnique.mockResolvedValueOnce({ id: 'user-id', role: UserRole.user });

    await expect(clinicsService.requestVetMembership('user-id', clinicId)).rejects.toThrow(BadRequestException);
    expect(prisma.clinicMembership.upsert).not.toHaveBeenCalled();
  });

  it('requires active vet or clinic admin membership before clinic-scoped access', async () => {
    prisma.clinicMembership.findFirst.mockResolvedValueOnce(null);

    await expect(clinicsService.requireVetClinicAccess(vetId, clinicId)).rejects.toThrow(ForbiddenException);
  });

  it('clinic admins approve vet memberships only inside their active clinic', async () => {
    jest.spyOn(clinicsService, 'requireClinicAdmin').mockResolvedValue({
      clinicId,
      role: ClinicMembershipRole.clinic_admin,
    } as any);
    prisma.clinicMembership.findFirst.mockResolvedValueOnce({
      id: membershipId,
      clinicId,
      role: ClinicMembershipRole.vet,
      approvedById: null,
      approvedAt: null,
    });
    prisma.clinicMembership.update.mockResolvedValueOnce({
      id: membershipId,
      status: ClinicMembershipStatus.active,
    });

    const result = await clinicsService.approveVet(adminId, membershipId);

    expect(prisma.clinicMembership.update).toHaveBeenCalledWith({
      where: { id: membershipId },
      data: expect.objectContaining({
        status: ClinicMembershipStatus.active,
        approvedById: adminId,
        approvedAt: expect.any(Date),
      }),
      include: expect.any(Object),
    });
    expect(result.status).toBe(ClinicMembershipStatus.active);
  });

  it('platform admins approve clinics and activate pending clinic-admin memberships transactionally', async () => {
    prisma.clinic.findUnique.mockResolvedValueOnce({
      id: clinicId,
      verificationStatus: ClinicVerificationStatus.pending,
    });
    const tx = {
      clinic: {
        update: jest.fn().mockResolvedValue({
          id: clinicId,
          verificationStatus: ClinicVerificationStatus.approved,
          isActive: true,
        }),
      },
      clinicMembership: {
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
    };
    prisma.$transaction.mockImplementationOnce((callback: any) => callback(tx));

    const result = await platformAdminService.approveClinic(clinicId, adminId);

    expect(tx.clinic.update).toHaveBeenCalledWith({
      where: { id: clinicId },
      data: {
        verificationStatus: ClinicVerificationStatus.approved,
        rejectionReason: null,
        isActive: true,
      },
    });
    expect(tx.clinicMembership.updateMany).toHaveBeenCalledWith({
      where: {
        clinicId,
        role: ClinicMembershipRole.clinic_admin,
        status: ClinicMembershipStatus.pending,
      },
      data: {
        status: ClinicMembershipStatus.active,
        approvedById: adminId,
        approvedAt: expect.any(Date),
      },
    });
    expect(result.verificationStatus).toBe(ClinicVerificationStatus.approved);
  });

  it('platform admins reject and suspend clinics without deleting records', async () => {
    prisma.clinic.findUnique.mockResolvedValue({ id: clinicId });
    prisma.clinicMembership.updateMany.mockResolvedValueOnce({ count: 2 });
    prisma.clinic.update
      .mockResolvedValueOnce({
        id: clinicId,
        verificationStatus: ClinicVerificationStatus.rejected,
        rejectionReason: 'Missing documents',
      })
      .mockResolvedValueOnce({
        id: clinicId,
        isActive: false,
        rejectionReason: 'Compliance review',
      });

    await expect(platformAdminService.rejectClinic(clinicId, 'Missing documents')).resolves.toMatchObject({
      verificationStatus: ClinicVerificationStatus.rejected,
    });
    await expect(platformAdminService.suspendClinic(clinicId, 'Compliance review')).resolves.toMatchObject({
      isActive: false,
    });

    expect(prisma.clinicMembership.updateMany).toHaveBeenCalledWith({
      where: { clinicId, status: ClinicMembershipStatus.pending },
      data: { status: ClinicMembershipStatus.suspended },
    });
  });

  it('platform admins can reactivate only approved clinics', async () => {
    prisma.clinic.findUnique
      .mockResolvedValueOnce({ id: clinicId, verificationStatus: ClinicVerificationStatus.pending })
      .mockResolvedValueOnce({ id: clinicId, verificationStatus: ClinicVerificationStatus.approved });
    prisma.clinic.update.mockResolvedValueOnce({ id: clinicId, isActive: true, rejectionReason: null });

    await expect(platformAdminService.reactivateClinic(clinicId)).rejects.toThrow(BadRequestException);
    await expect(platformAdminService.reactivateClinic(clinicId)).resolves.toMatchObject({
      isActive: true,
      rejectionReason: null,
    });
  });

  it('platform admin clinic detail rejects missing clinics', async () => {
    prisma.clinic.findUnique.mockResolvedValueOnce(null);

    await expect(platformAdminService.getClinic('missing-clinic')).rejects.toThrow(NotFoundException);
  });
});
