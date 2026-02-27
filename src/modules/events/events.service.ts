import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventStatus, EventCategory, Prisma } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) { }

  async create(userId: string, createEventDto: CreateEventDto) {
    const data: Prisma.EventUncheckedCreateInput = {
      title: createEventDto.title,
      description: createEventDto.description,
      eventDate: createEventDto.eventDate,
      eventTime: createEventDto.eventTime,
      category: createEventDto.category as EventCategory,
      location: createEventDto.location,
      notes: createEventDto.notes,
      isRecurring: createEventDto.isRecurring,
      recurringType: createEventDto.recurringType,
      userId,
      petId: createEventDto.petId || undefined,
    };
    return this.prisma.event.create({ data });
  }

  async findByUser(userId: string) {
    return this.prisma.event.findMany({
      where: { userId, isActive: true },
      include: { pet: { select: { name: true, breed: true } } },
      orderBy: { eventDate: 'asc' },
    });
  }

  async findUpcoming(userId: string) {
    const today = new Date();
    return this.prisma.event.findMany({
      where: {
        userId,
        eventDate: { gte: today },
        status: EventStatus.event_scheduled,
        isActive: true,
      },
      include: { pet: { select: { name: true, breed: true } } },
      orderBy: { eventDate: 'asc' },
      take: 10,
    });
  }

  async findById(id: string, userId: string) {
    const event = await this.prisma.event.findFirst({
      where: { id, userId, isActive: true },
      include: { pet: { select: { name: true, breed: true } } },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async update(id: string, userId: string, updateEventDto: UpdateEventDto) {
    await this.findById(id, userId);

    const { petId, category, status, ...rest } = updateEventDto;
    const data: Prisma.EventUncheckedUpdateInput = {
      ...rest,
      ...(category ? { category: category as EventCategory } : {}),
      ...(status ? { status: status as EventStatus } : {}),
      ...(petId !== undefined ? { petId: petId || null } : {}),
    };

    return this.prisma.event.update({
      where: { id },
      data,
      include: { pet: { select: { name: true, breed: true } } },
    });
  }

  async delete(id: string, userId: string) {
    await this.findById(id, userId);
    await this.prisma.event.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async findByCategory(userId: string, category: string) {
    return this.prisma.event.findMany({
      where: { userId, category: category as EventCategory, isActive: true },
      include: { pet: { select: { name: true, breed: true } } },
      orderBy: { eventDate: 'asc' },
    });
  }
}