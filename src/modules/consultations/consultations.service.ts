import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Consultation, ConsultationDocument } from './schemas/consultation.schema';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { PetsService } from '../pets/pets.service';

@Injectable()
export class ConsultationsService {
  constructor(
    @InjectModel(Consultation.name) private consultationModel: Model<ConsultationDocument>,
    private petsService: PetsService,
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
    const consultation = await this.consultationModel
      .findOne({ _id: id, userId: new Types.ObjectId(userId), isActive: true })
      .populate('petId');

    if (!consultation) {
      throw new NotFoundException(`Consultation with ID '${id}' does not exist or you don't have permission to access it`);
    }

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

    if (consultation.status !== 'pending') {
      throw new ConflictException('Consultation already assigned or completed');
    }

    consultation.assignedVet = new Types.ObjectId(vetId);
    consultation.status = 'assigned';
    await consultation.save();

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
}