import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@modules/prisma/prisma.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { PetsService } from '../pets/pets.service';
import { v4 as uuidv4 } from 'uuid';
import { ConsultationStatus, Prisma } from '@prisma/client';

@Injectable()
export class ConsultationsService {
  constructor(
    private prisma: PrismaService,
    private petsService: PetsService,
  ) { }

  async create(userId: string, createConsultationDto: CreateConsultationDto) {
    await this.petsService.findById(createConsultationDto.petId, userId);

    const data: Prisma.ConsultationUncheckedCreateInput = {
      reason: createConsultationDto.reason,
      symptoms: createConsultationDto.symptoms,
      consultationType: createConsultationDto.consultationType as Prisma.ConsultationUncheckedCreateInput['consultationType'],
      duration: createConsultationDto.duration,
      cost: createConsultationDto.cost,
      petId: createConsultationDto.petId,
      userId,
      status: ConsultationStatus.pending,
      scheduledDate: new Date(createConsultationDto.scheduledDate),
    };

    return this.prisma.consultation.create({ data });
  }

  async findAll(userId: string) {
    return this.prisma.consultation.findMany({
      where: { userId, isActive: true },
      include: { pet: { select: { name: true, species: true } } },
      orderBy: { scheduledDate: 'desc' },
    });
  }

  async findByStatus(userId: string, status: string) {
    return this.prisma.consultation.findMany({
      where: { userId, status: status as ConsultationStatus, isActive: true },
      include: { pet: { select: { name: true, species: true } } },
      orderBy: { scheduledDate: 'desc' },
    });
  }

  async findById(id: string, userId: string) {
    const consultation = await this.prisma.consultation.findUnique({
      where: { id },
      include: {
        pet: true,
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!consultation) {
      throw new NotFoundException(`Consultation with ID '${id}' does not exist`);
    }
    if (!consultation.isActive) {
      throw new NotFoundException(`Consultation with ID '${id}' has been deleted`);
    }
    if (consultation.userId !== userId) {
      throw new ForbiddenException(`You don't have permission to access consultation '${id}'`);
    }

    return consultation;
  }

  async update(id: string, userId: string, updateConsultationDto: UpdateConsultationDto) {
    await this.findById(id, userId);

    const { status, followUpDate, consultationType, paymentStatus, ...rest } = updateConsultationDto;
    const updateData: Prisma.ConsultationUncheckedUpdateInput = {
      ...rest,
      ...(status ? { status: status as ConsultationStatus } : {}),
      ...(followUpDate ? { followUpDate: new Date(followUpDate) } : {}),
      ...(consultationType ? { consultationType: consultationType as Prisma.ConsultationUncheckedUpdateInput['consultationType'] } : {}),
      ...(paymentStatus ? { paymentStatus: paymentStatus as Prisma.ConsultationUncheckedUpdateInput['paymentStatus'] } : {}),
    };

    return this.prisma.consultation.update({ where: { id }, data: updateData });
  }

  async cancel(id: string, userId: string) {
    return this.update(id, userId, { status: 'cancelled' });
  }

  async startConsultation(id: string, userId: string, meetingLink: string) {
    return this.update(id, userId, {
      status: 'in_progress',
      meetingLink,
      meetingId: `meeting_${id}_${Date.now()}`,
    });
  }

  async completeConsultation(id: string, userId: string, notes: string, prescription?: string) {
    return this.update(id, userId, {
      status: 'completed',
      notes,
      prescription,
    });
  }

  async getUpcoming(userId: string) {
    const now = new Date();
    return this.prisma.consultation.findMany({
      where: {
        userId,
        status: ConsultationStatus.assigned,
        scheduledDate: { gte: now },
        isActive: true,
      },
      include: { pet: { select: { name: true, species: true } } },
      orderBy: { scheduledDate: 'asc' },
      take: 5,
    });
  }

  async getVetQueue() {
    return this.prisma.consultation.findMany({
      where: { status: ConsultationStatus.pending, isActive: true },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        pet: { select: { name: true, species: true, breed: true, age: true } },
      },
      orderBy: { scheduledDate: 'asc' },
    });
  }

  async getVetActive(vetId: string) {
    return this.prisma.consultation.findMany({
      where: {
        assignedVetId: vetId,
        status: { in: [ConsultationStatus.assigned, ConsultationStatus.in_progress] },
        isActive: true,
      },
      include: {
        user: { select: { firstName: true, lastName: true, email: true, phone: true } },
        pet: { select: { name: true, species: true, breed: true, age: true, weight: true } },
      },
      orderBy: { scheduledDate: 'asc' },
    });
  }

  async getVetHistory(vetId: string) {
    return this.prisma.consultation.findMany({
      where: { assignedVetId: vetId, status: ConsultationStatus.completed, isActive: true },
      include: {
        user: { select: { firstName: true, lastName: true } },
        pet: { select: { name: true, species: true } },
      },
      orderBy: { updatedAt: 'desc' },
      take: 50,
    });
  }

  async acceptConsultation(consultationId: string, vetId: string) {
    const consultation = await this.prisma.consultation.findFirst({
      where: { id: consultationId, isActive: true },
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    // Idempotent - if already assigned to this vet
    if (consultation.assignedVetId === vetId && consultation.status === ConsultationStatus.assigned) {
      return this.prisma.consultation.findUnique({
        where: { id: consultationId },
        include: {
          user: { select: { firstName: true, lastName: true, email: true, phone: true } },
          pet: { select: { name: true, species: true, breed: true, age: true, weight: true } },
        },
      });
    }

    if (consultation.status !== ConsultationStatus.pending) {
      throw new ConflictException('Consultation already assigned or completed');
    }

    // Atomic update to prevent race conditions
    try {
      await this.prisma.consultation.update({
        where: { id: consultationId },
        data: { assignedVetId: vetId, status: ConsultationStatus.assigned },
      });
    } catch {
      throw new ConflictException('Consultation already assigned or completed');
    }

    return this.prisma.consultation.findUnique({
      where: { id: consultationId },
      include: {
        user: { select: { firstName: true, lastName: true, email: true, phone: true } },
        pet: { select: { name: true, species: true, breed: true, age: true, weight: true } },
      },
    });
  }

  async releaseConsultation(consultationId: string, vetId: string) {
    const consultation = await this.prisma.consultation.findFirst({
      where: { id: consultationId, isActive: true },
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }
    if (consultation.assignedVetId !== vetId) {
      throw new ForbiddenException('You are not assigned to this consultation');
    }

    return this.prisma.consultation.update({
      where: { id: consultationId },
      data: { status: ConsultationStatus.completed },
    });
  }

  // Method for vets to access any consultation
  async findByIdForVet(id: string) {
    const consultation = await this.prisma.consultation.findFirst({
      where: { id, isActive: true },
      include: {
        user: { select: { firstName: true, lastName: true, email: true, phone: true } },
        pet: { select: { name: true, species: true, breed: true, age: true, weight: true } },
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!consultation) {
      throw new NotFoundException(`Consultation with ID '${id}' does not exist`);
    }
    return consultation;
  }

  // Check if consultation is assigned to a specific vet
  async isConsultationAssignedToVet(consultationId: string, vetId: string) {
    const consultation = await this.prisma.consultation.findFirst({
      where: { id: consultationId, isActive: true },
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    return {
      isAssigned: consultation.assignedVetId === vetId,
      status: consultation.status,
      assignedVet: consultation.assignedVetId,
    };
  }

  // Send message in consultation — messages stored in separate table
  async sendMessage(consultationId: string, userId: string, message: string, isVet: boolean = false) {
    const consultation = await this.prisma.consultation.findFirst({
      where: { id: consultationId, isActive: true },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
        pet: { select: { name: true, species: true } },
      },
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    if (!isVet && consultation.userId !== userId) {
      throw new ForbiddenException("You don't have permission to send messages in this consultation");
    }
    if (isVet && consultation.assignedVetId !== userId) {
      throw new ForbiddenException('You are not assigned to this consultation');
    }

    const newMessage = await this.prisma.consultationMessage.create({
      data: {
        consultationId,
        text: message,
        senderId: userId,
        senderRole: isVet ? 'doctor' : 'user',
        isRead: false,
      },
    });

    // Update consultation metadata (fire and forget — don't await)
    this.prisma.consultation.update({
      where: { id: consultationId },
      data: {
        lastMessageAt: new Date(),
        ...(!isVet ? { unreadCount: { increment: 1 } } : {}),
      },
    }).catch(e => console.error('Failed to update consultation metadata:', e));

    // Supabase Realtime will automatically pick up this INSERT
    // Return the consultation with all messages including the new one
    return {
      ...consultation,
      messages: [...consultation.messages, newMessage],
      lastMessageAt: new Date(),
    };
  }

  // Debug method
  async getConsultationDebugInfo(id: string) {
    const consultation = await this.prisma.consultation.findUnique({ where: { id } });

    if (!consultation) {
      return { exists: false, message: 'Consultation not found' };
    }

    return {
      exists: true,
      id: consultation.id,
      userId: consultation.userId,
      isActive: consultation.isActive,
      status: consultation.status,
      assignedVet: consultation.assignedVetId,
      createdAt: consultation.createdAt,
    };
  }

  async markMessagesAsRead(consultationId: string, userId: string, messageIds?: string[]) {
    const consultation = await this.prisma.consultation.findUnique({
      where: { id: consultationId },
      include: { messages: true },
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }
    if (consultation.userId !== userId && consultation.assignedVetId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const isVetReading = consultation.assignedVetId === userId;

    // Determine which messages to mark as read
    const messagesToUpdate = consultation.messages.filter(msg => {
      const isUserMessage = msg.senderRole === 'user';
      const shouldMarkAsRead = (isUserMessage && isVetReading) || (!isUserMessage && !isVetReading);
      if (!shouldMarkAsRead || msg.isRead) return false;
      if (messageIds) return messageIds.includes(msg.id);
      return true;
    });

    if (messagesToUpdate.length > 0) {
      await this.prisma.consultationMessage.updateMany({
        where: { id: { in: messagesToUpdate.map(m => m.id) } },
        data: { isRead: true },
      });

      // Reset unread count
      await this.prisma.consultation.update({
        where: { id: consultationId },
        data: { unreadCount: 0 },
      });

      // Supabase Realtime will pick up the UPDATE on consultation_messages
    }

    return this.prisma.consultation.findUnique({
      where: { id: consultationId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
  }
}