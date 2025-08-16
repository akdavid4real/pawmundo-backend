import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(@InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>) {}

  async create(userId: string, createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    const appointment = new this.appointmentModel({
      ...createAppointmentDto,
      userId,
      appointmentDate: new Date(createAppointmentDto.appointmentDate)
    });
    return appointment.save();
  }

  async findByUser(userId: string): Promise<Appointment[]> {
    return this.appointmentModel
      .find({ userId, isActive: true })
      .populate('petId', 'name species breed')
      .sort({ appointmentDate: 1 })
      .exec();
  }

  async findById(id: string, userId?: string): Promise<Appointment> {
    const appointment = await this.appointmentModel
      .findById(id)
      .populate('petId', 'name species breed')
      .exec();
    
    if (!appointment) throw new NotFoundException('Appointment not found');
    
    if (userId && appointment.userId.toString() !== userId) {
      throw new ForbiddenException('Access denied');
    }
    
    return appointment;
  }

  async update(id: string, userId: string, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    await this.findById(id, userId);
    
    const updateData: any = { ...updateAppointmentDto };
    if (updateAppointmentDto.appointmentDate) {
      updateData.appointmentDate = new Date(updateAppointmentDto.appointmentDate);
    }
    
    return this.appointmentModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('petId', 'name species breed')
      .exec();
  }

  async cancel(id: string, userId: string): Promise<Appointment> {
    await this.findById(id, userId);
    return this.appointmentModel
      .findByIdAndUpdate(id, { status: 'cancelled' }, { new: true })
      .populate('petId', 'name species breed')
      .exec();
  }

  async delete(id: string, userId: string): Promise<Appointment> {
    await this.findById(id, userId);
    return this.appointmentModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .exec();
  }

  async findUpcoming(userId: string): Promise<Appointment[]> {
    const today = new Date();
    return this.appointmentModel
      .find({
        userId,
        isActive: true,
        appointmentDate: { $gte: today },
        status: { $in: ['scheduled', 'confirmed'] }
      })
      .populate('petId', 'name species breed')
      .sort({ appointmentDate: 1 })
      .exec();
  }
}