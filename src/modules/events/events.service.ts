import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventStatus, EventCategory, Prisma } from '@prisma/client';
import { PetsService } from '../pets/pets.service';

@Injectable()
export class EventsService {
  constructor(
    private prisma: PrismaService,
    private petsService: PetsService,
  ) { }

  private mapCategory(cat: string): EventCategory {
    const isPrefixed = ['grooming', 'training'].includes(cat);
    return (isPrefixed ? cat : `event_${cat}`) as EventCategory;
  }

  async create(userId: string, createEventDto: CreateEventDto) {
    if (createEventDto.petId) {
      await this.petsService.findById(createEventDto.petId, userId);
    }

    const data: Prisma.EventUncheckedCreateInput = {
      title: createEventDto.title,
      description: createEventDto.description,
      eventDate: new Date(createEventDto.eventDate),
      eventTime: createEventDto.eventTime,
      category: this.mapCategory(createEventDto.category),
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
    if (updateEventDto.petId) {
      await this.petsService.findById(updateEventDto.petId, userId);
    }

    // Map DTO status to Prisma EventStatus
    const mapStatus = (stat: string): EventStatus => {
      return `event_${stat}` as EventStatus;
    };

    const { petId, category, status, eventDate, ...rest } = updateEventDto;
    const data: Prisma.EventUncheckedUpdateInput = {
      ...rest,
      ...(eventDate ? { eventDate: new Date(eventDate) } : {}),
      ...(category ? { category: this.mapCategory(category) } : {}),
      ...(status ? { status: mapStatus(status) } : {}),
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
      where: { userId, category: this.mapCategory(category), isActive: true },
      include: { pet: { select: { name: true, breed: true } } },
      orderBy: { eventDate: 'asc' },
    });
  }
}
