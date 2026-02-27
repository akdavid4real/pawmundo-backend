import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) { }

  async create(userId: string, createAppointmentDto: CreateAppointmentDto) {
    return this.prisma.appointment.create({
      data: {
        ...createAppointmentDto,
        userId,
        appointmentDate: new Date(createAppointmentDto.appointmentDate),
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.appointment.findMany({
      where: { userId, isActive: true },
      include: { pet: { select: { name: true, species: true, breed: true } } },
      orderBy: { appointmentDate: 'asc' },
    });
  }

  async findById(id: string, userId?: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: { pet: { select: { name: true, species: true, breed: true } } },
    });

    if (!appointment) throw new NotFoundException(`Appointment with ID '${id}' does not exist`);

    if (userId && appointment.userId !== userId) {
      throw new ForbiddenException(`You don't have permission to access this appointment (ID: ${id}). This appointment belongs to another user.`);
    }

    return appointment;
  }

  async update(id: string, userId: string, updateAppointmentDto: UpdateAppointmentDto) {
    await this.findById(id, userId);

    const updateData: any = { ...updateAppointmentDto };
    if (updateAppointmentDto.appointmentDate) {
      updateData.appointmentDate = new Date(updateAppointmentDto.appointmentDate);
    }

    return this.prisma.appointment.update({
      where: { id },
      data: updateData,
      include: { pet: { select: { name: true, species: true, breed: true } } },
    });
  }

  async cancel(id: string, userId: string) {
    await this.findById(id, userId);
    return this.prisma.appointment.update({
      where: { id },
      data: { status: 'cancelled' },
      include: { pet: { select: { name: true, species: true, breed: true } } },
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
        status: { in: ['scheduled', 'confirmed'] },
      },
      include: { pet: { select: { name: true, species: true, breed: true } } },
      orderBy: { appointmentDate: 'asc' },
    });
  }
}