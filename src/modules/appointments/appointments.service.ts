import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AppointmentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PetsService } from '../pets/pets.service';
import { ClinicsService } from '../clinics/clinics.service';

@Injectable()
export class AppointmentsService {
  constructor(
    private prisma: PrismaService,
    private petsService: PetsService,
    private clinicsService: ClinicsService,
  ) { }

  private readonly appointmentInclude = {
    pet: { select: { name: true, species: true, breed: true } },
    user: { select: { firstName: true, lastName: true, email: true, phone: true } },
    assignedVet: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
    clinic: { select: { id: true, name: true, email: true, phone: true, address: true } },
  };

  private buildDayRange(date?: string) {
    if (!date) return undefined;
    const start = new Date(date);
    if (Number.isNaN(start.getTime())) {
      throw new BadRequestException('Invalid date filter');
    }
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return { gte: start, lt: end };
  }

  private async normalizeClinicAssignment(dto: CreateAppointmentDto | UpdateAppointmentDto, options: { requireClinic: boolean }) {
    if (options.requireClinic && !dto.clinicId) {
      throw new BadRequestException('Clinic is required for appointment booking');
    }

    if (!dto.clinicId && dto.assignedVetId) {
      throw new BadRequestException('Clinic is required when assigning a veterinarian');
    }

    if (!dto.clinicId) return {};

    const clinic = await this.clinicsService.findApprovedClinicOrThrow(dto.clinicId);
    if (!dto.assignedVetId) {
      throw new BadRequestException('Please choose an active veterinarian for this clinic appointment');
    }

    const membership = await this.clinicsService.requireActiveVetMembership(dto.assignedVetId, dto.clinicId);
    const vetName = [membership.user.firstName, membership.user.lastName].filter(Boolean).join(' ').trim();

    return {
      vetName: vetName || dto.vetName,
      vetClinic: clinic.name,
      vetPhone: dto.vetPhone || membership.user.phone || undefined,
      vetEmail: dto.vetEmail || membership.user.email,
    };
  }

  private async requireClinicAppointmentAccess(appointmentId: string, clinicAdminId: string) {
    const membership = await this.clinicsService.requireClinicAdmin(clinicAdminId);
    const appointment = await this.prisma.appointment.findFirst({
      where: { id: appointmentId, clinicId: membership.clinicId, isActive: true },
      include: this.appointmentInclude,
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID '${appointmentId}' does not exist for this clinic`);
    }

    return { appointment, clinicId: membership.clinicId };
  }

  private async requireVetAppointmentAccess(appointmentId: string, vetId: string) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id: appointmentId, assignedVetId: vetId, isActive: true },
      include: this.appointmentInclude,
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID '${appointmentId}' does not exist for this veterinarian`);
    }

    if (appointment.clinicId) {
      await this.clinicsService.requireActiveVetMembership(vetId, appointment.clinicId);
    }

    return appointment;
  }

  async create(userId: string, createAppointmentDto: CreateAppointmentDto) {
    await this.petsService.findById(createAppointmentDto.petId, userId);
    const assignment = await this.normalizeClinicAssignment(createAppointmentDto, { requireClinic: true });

    return this.prisma.appointment.create({
      data: {
        ...createAppointmentDto,
        ...assignment,
        userId,
        appointmentDate: new Date(createAppointmentDto.appointmentDate),
      },
      include: this.appointmentInclude,
    });
  }

  async findByUser(userId: string) {
    return this.prisma.appointment.findMany({
      where: { userId, isActive: true },
      include: this.appointmentInclude,
      orderBy: { appointmentDate: 'asc' },
    });
  }

  async findById(id: string, userId?: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: this.appointmentInclude,
    });

    if (!appointment) throw new NotFoundException(`Appointment with ID '${id}' does not exist`);

    if (userId && appointment.userId !== userId) {
      throw new ForbiddenException(`You don't have permission to access this appointment (ID: ${id}). This appointment belongs to another user.`);
    }

    return appointment;
  }

  async update(id: string, userId: string, updateAppointmentDto: UpdateAppointmentDto) {
    await this.findById(id, userId);
    if (updateAppointmentDto.petId) {
      await this.petsService.findById(updateAppointmentDto.petId, userId);
    }
    const assignment = await this.normalizeClinicAssignment(updateAppointmentDto, { requireClinic: false });

    const updateData: any = { ...updateAppointmentDto, ...assignment };
    if (updateAppointmentDto.appointmentDate) {
      updateData.appointmentDate = new Date(updateAppointmentDto.appointmentDate);
    }

    return this.prisma.appointment.update({
      where: { id },
      data: updateData,
      include: this.appointmentInclude,
    });
  }

  async cancel(id: string, userId: string) {
    await this.findById(id, userId);
    return this.prisma.appointment.update({
      where: { id },
      data: { status: AppointmentStatus.cancelled },
      include: this.appointmentInclude,
    });
  }

  async delete(id: string, userId: string) {
    await this.findById(id, userId);
    return this.prisma.appointment.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async findUpcoming(userId: string) {
    const today = new Date();
    return this.prisma.appointment.findMany({
      where: {
        userId,
        isActive: true,
        appointmentDate: { gte: today },
        status: { in: [AppointmentStatus.scheduled, AppointmentStatus.confirmed] },
      },
      include: this.appointmentInclude,
      orderBy: { appointmentDate: 'asc' },
    });
  }

  async findForClinicAdmin(clinicAdminId: string, filters: {
    status?: AppointmentStatus;
    vetId?: string;
    date?: string;
    patientId?: string;
  } = {}) {
    const membership = await this.clinicsService.requireClinicAdmin(clinicAdminId);
    const dateRange = this.buildDayRange(filters.date);

    return this.prisma.appointment.findMany({
      where: {
        clinicId: membership.clinicId,
        isActive: true,
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.vetId ? { assignedVetId: filters.vetId } : {}),
        ...(filters.patientId ? { OR: [{ petId: filters.patientId }, { userId: filters.patientId }] } : {}),
        ...(dateRange ? { appointmentDate: dateRange } : {}),
      },
      include: this.appointmentInclude,
      orderBy: [{ appointmentDate: 'asc' }, { appointmentTime: 'asc' }],
    });
  }

  async findOneForClinicAdmin(id: string, clinicAdminId: string) {
    const { appointment } = await this.requireClinicAppointmentAccess(id, clinicAdminId);
    return appointment;
  }

  async updateForClinicAdmin(id: string, clinicAdminId: string, dto: UpdateAppointmentDto) {
    const { appointment } = await this.requireClinicAppointmentAccess(id, clinicAdminId);
    const nextDto = { ...dto, clinicId: dto.clinicId ?? appointment.clinicId ?? undefined };
    const assignment = await this.normalizeClinicAssignment(nextDto, { requireClinic: false });
    const updateData: any = { ...dto, ...assignment };

    if (dto.appointmentDate) {
      updateData.appointmentDate = new Date(dto.appointmentDate);
    }

    return this.prisma.appointment.update({
      where: { id },
      data: updateData,
      include: this.appointmentInclude,
    });
  }

  async transitionForClinicAdmin(id: string, clinicAdminId: string, status: AppointmentStatus) {
    await this.requireClinicAppointmentAccess(id, clinicAdminId);
    return this.prisma.appointment.update({
      where: { id },
      data: { status },
      include: this.appointmentInclude,
    });
  }

  async findForVet(vetId: string) {
    const clinicIds = await this.clinicsService.getActiveClinicIdsForUser(vetId);
    return this.prisma.appointment.findMany({
      where: {
        assignedVetId: vetId,
        isActive: true,
        ...(clinicIds.length > 0
          ? { OR: [{ clinicId: null }, { clinicId: { in: clinicIds } }] }
          : { clinicId: null }),
      },
      include: this.appointmentInclude,
      orderBy: [{ appointmentDate: 'asc' }, { appointmentTime: 'asc' }],
    });
  }

  async findOneForVet(id: string, vetId: string) {
    return this.requireVetAppointmentAccess(id, vetId);
  }

  async transitionForVet(id: string, vetId: string, status: AppointmentStatus) {
    await this.requireVetAppointmentAccess(id, vetId);
    return this.prisma.appointment.update({
      where: { id },
      data: { status },
      include: this.appointmentInclude,
    });
  }
}
