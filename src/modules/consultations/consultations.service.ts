import { Injectable, NotFoundException } from '@nestjs/common';
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
      status: 'scheduled',
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
      throw new NotFoundException('Consultation not found');
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
}