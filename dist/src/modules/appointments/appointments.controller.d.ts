import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    create(req: any, createAppointmentDto: CreateAppointmentDto): Promise<import("./schemas/appointment.schema").Appointment>;
    findMyAppointments(req: any): Promise<import("./schemas/appointment.schema").Appointment[]>;
    findUpcoming(req: any): Promise<import("./schemas/appointment.schema").Appointment[]>;
    findOne(id: string, req: any): Promise<import("./schemas/appointment.schema").Appointment>;
    update(id: string, updateAppointmentDto: UpdateAppointmentDto, req: any): Promise<import("./schemas/appointment.schema").Appointment>;
    cancel(id: string, req: any): Promise<import("./schemas/appointment.schema").Appointment>;
    remove(id: string, req: any): Promise<import("./schemas/appointment.schema").Appointment>;
}
