import { Model } from 'mongoose';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
export declare class AppointmentsService {
    private appointmentModel;
    constructor(appointmentModel: Model<AppointmentDocument>);
    create(userId: string, createAppointmentDto: CreateAppointmentDto): Promise<Appointment>;
    findByUser(userId: string): Promise<Appointment[]>;
    findById(id: string, userId?: string): Promise<Appointment>;
    update(id: string, userId: string, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment>;
    cancel(id: string, userId: string): Promise<Appointment>;
    delete(id: string, userId: string): Promise<Appointment>;
    findUpcoming(userId: string): Promise<Appointment[]>;
}
