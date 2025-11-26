import { Injectable, NotFoundException, ConflictException, ForbiddenException, forwardRef, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Consultation, ConsultationDocument } from './schemas/consultation.schema';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { PetsService } from '../pets/pets.service';
import { ConsultationsGateway } from './consultations.gateway';

@Injectable()
export class ConsultationsService {
  constructor(
    @InjectModel(Consultation.name) private consultationModel: Model<ConsultationDocument>,
    private petsService: PetsService,
    @Inject(forwardRef(() => ConsultationsGateway))
    private consultationsGateway: ConsultationsGateway,
  ) {}

  async create(userId: string, createConsultationDto: CreateConsultationDto): Promise<Consultation> {
    await this.petsService.findById(createConsultationDto.petId, userId);

    const consultation = new this.consultationModel({
      ...createConsultationDto,
      userId: new Types.ObjectId(userId),
      petId: new Types.ObjectId(createConsultationDto.petId),
      status: 'pending',
      scheduledDate: new Date(createConsultationDto.scheduledDate),
    });

    return consultation.save();
  }

  async findAll(userId: string): Promise<Consultation[]> {
    return this.consultationModel
      .find({ userId: new Types.ObjectId(userId), isActive: true })
      .populate('petId', 'name species')
      .sort({ scheduledDate: -1 });
  }

  async findByStatus(userId: string, status: string): Promise<Consultation[]> {
    return this.consultationModel
      .find({ userId: new Types.ObjectId(userId), status, isActive: true })
      .populate('petId', 'name species')
      .sort({ scheduledDate: -1 });
  }

  async findById(id: string, userId: string): Promise<Consultation> {
    // First check if consultation exists at all
    const consultationExists = await this.consultationModel.findById(id);
    
    if (!consultationExists) {
      throw new NotFoundException(`Consultation with ID '${id}' does not exist`);
    }

    // Check if it's inactive
    if (!consultationExists.isActive) {
      throw new NotFoundException(`Consultation with ID '${id}' has been deleted`);
    }

    // Check if user has permission
    if (consultationExists.userId.toString() !== userId) {
      throw new ForbiddenException(`You don't have permission to access consultation '${id}'`);
    }

    const consultation = await this.consultationModel
      .findById(id)
      .populate('petId');

    return consultation;
  }

  async update(id: string, userId: string, updateConsultationDto: UpdateConsultationDto): Promise<Consultation> {
    await this.findById(id, userId);

    const updateData: any = { ...updateConsultationDto };
    if (updateConsultationDto.followUpDate) {
      updateData.followUpDate = new Date(updateConsultationDto.followUpDate);
    }

    return this.consultationModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async cancel(id: string, userId: string): Promise<Consultation> {
    return this.update(id, userId, { status: 'cancelled' });
  }

  async startConsultation(id: string, userId: string, meetingLink: string): Promise<Consultation> {
    return this.update(id, userId, { 
      status: 'in-progress', 
      meetingLink,
      meetingId: `meeting_${id}_${Date.now()}`
    });
  }

  async completeConsultation(id: string, userId: string, notes: string, prescription?: string): Promise<Consultation> {
    return this.update(id, userId, { 
      status: 'completed', 
      notes,
      prescription
    });
  }

  async getUpcoming(userId: string): Promise<Consultation[]> {
    const now = new Date();
    return this.consultationModel
      .find({
        userId: new Types.ObjectId(userId),
        status: 'scheduled',
        scheduledDate: { $gte: now },
        isActive: true
      })
      .populate('petId', 'name species')
      .sort({ scheduledDate: 1 })
      .limit(5);
  }

  async getVetQueue(): Promise<Consultation[]> {
    return this.consultationModel
      .find({ status: 'pending', isActive: true })
      .populate('userId', 'firstName lastName email')
      .populate('petId', 'name species breed age')
      .sort({ scheduledDate: 1 });
  }

  async getVetActive(vetId: string): Promise<Consultation[]> {
    return this.consultationModel
      .find({ assignedVet: new Types.ObjectId(vetId), status: { $in: ['assigned', 'in-progress'] }, isActive: true })
      .populate('userId', 'firstName lastName email phone')
      .populate('petId', 'name species breed age weight')
      .sort({ scheduledDate: 1 });
  }

  async getVetHistory(vetId: string): Promise<Consultation[]> {
    return this.consultationModel
      .find({ assignedVet: new Types.ObjectId(vetId), status: 'completed', isActive: true })
      .populate('userId', 'firstName lastName')
      .populate('petId', 'name species')
      .sort({ updatedAt: -1 })
      .limit(50);
  }

  async acceptConsultation(consultationId: string, vetId: string): Promise<Consultation> {
    const consultation = await this.consultationModel.findOne({ _id: consultationId, isActive: true });
    
    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    // If already assigned to this vet, return the consultation (idempotent)
    if (consultation.assignedVet?.toString() === vetId && consultation.status === 'assigned') {
      return this.consultationModel
        .findById(consultationId)
        .populate('userId', 'firstName lastName email phone')
        .populate('petId', 'name species breed age weight');
    }

    if (consultation.status !== 'pending') {
      throw new ConflictException('Consultation already assigned or completed');
    }

    // Use findOneAndUpdate for atomic operation to prevent race conditions
    const updatedConsultation = await this.consultationModel.findOneAndUpdate(
      { _id: consultationId, status: 'pending', isActive: true },
      { 
        assignedVet: new Types.ObjectId(vetId),
        status: 'assigned'
      },
      { new: true }
    );

    if (!updatedConsultation) {
      throw new ConflictException('Consultation already assigned or completed');
    }

    return this.consultationModel
      .findById(consultationId)
      .populate('userId', 'firstName lastName email phone')
      .populate('petId', 'name species breed age weight');
  }

  async releaseConsultation(consultationId: string, vetId: string): Promise<Consultation> {
    const consultation = await this.consultationModel.findOne({ _id: consultationId, isActive: true });
    
    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    if (consultation.assignedVet?.toString() !== vetId) {
      throw new ForbiddenException('You are not assigned to this consultation');
    }

    consultation.assignedVet = undefined;
    consultation.status = 'pending';
    await consultation.save();

    return consultation;
  }

  // Method for vets to access any consultation
  async findByIdForVet(id: string): Promise<Consultation> {
    const consultation = await this.consultationModel
      .findOne({ _id: id, isActive: true })
      .populate('userId', 'firstName lastName email phone')
      .populate('petId', 'name species breed age weight');

    if (!consultation) {
      throw new NotFoundException(`Consultation with ID '${id}' does not exist`);
    }

    return consultation;
  }

  // Check if consultation is assigned to a specific vet
  async isConsultationAssignedToVet(consultationId: string, vetId: string): Promise<{ isAssigned: boolean; status: string; assignedVet?: string }> {
    const consultation = await this.consultationModel.findOne({ _id: consultationId, isActive: true });
    
    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    return {
      isAssigned: consultation.assignedVet?.toString() === vetId,
      status: consultation.status,
      assignedVet: consultation.assignedVet?.toString()
    };
  }

  // Send message in consultation
  async sendMessage(consultationId: string, userId: string, message: string, isVet: boolean = false): Promise<Consultation> {
    const consultation = await this.consultationModel.findOne({ _id: consultationId, isActive: true });
    
    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    // Check permissions
    if (!isVet && consultation.userId.toString() !== userId) {
      throw new ForbiddenException('You don\'t have permission to send messages in this consultation');
    }

    if (isVet && consultation.assignedVet?.toString() !== userId) {
      throw new ForbiddenException('You are not assigned to this consultation');
    }

    const newMessage = {
      id: new Types.ObjectId().toString(),
      text: message,
      sender: isVet ? 'doctor' as const : 'user' as const,
      timestamp: new Date(),
      isRead: false
    };

    consultation.messages.push(newMessage);
    consultation.lastMessageAt = new Date();
    
    if (!isVet) {
      consultation.unreadCount = (consultation.unreadCount || 0) + 1;
    }

    await consultation.save();

    // Emit WebSocket event for real-time updates
    this.consultationsGateway.notifyConsultationUpdated(consultationId, {
      newMessage: newMessage,
      unreadCount: consultation.unreadCount,
      lastMessageAt: consultation.lastMessageAt,
    });

    return this.consultationModel
      .findById(consultationId)
      .populate('userId', 'firstName lastName email phone')
      .populate('petId', 'name species breed age weight');
  }

  // Debug method to check consultation details
  async getConsultationDebugInfo(id: string): Promise<any> {
    const consultation = await this.consultationModel.findById(id);
    
    if (!consultation) {
      return { exists: false, message: 'Consultation not found' };
    }

    return {
      exists: true,
      id: consultation._id,
      userId: consultation.userId,
      isActive: consultation.isActive,
      status: consultation.status,
      assignedVet: consultation.assignedVet,
      createdAt: (consultation as any).createdAt
    };
  }
}