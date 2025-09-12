/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.module.ts":
/*!***************************!*\
  !*** ./src/app.module.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const bull_1 = __webpack_require__(/*! @nestjs/bull */ "@nestjs/bull");
const mongodb_config_1 = __webpack_require__(/*! @config/mongodb.config */ "./src/config/mongodb.config.ts");
const redis_config_1 = __webpack_require__(/*! @config/redis.config */ "./src/config/redis.config.ts");
const cloudinary_config_1 = __webpack_require__(/*! @config/cloudinary.config */ "./src/config/cloudinary.config.ts");
const auth_module_1 = __webpack_require__(/*! @modules/auth/auth.module */ "./src/modules/auth/auth.module.ts");
const user_module_1 = __webpack_require__(/*! @modules/user/user.module */ "./src/modules/user/user.module.ts");
const pets_module_1 = __webpack_require__(/*! @modules/pets/pets.module */ "./src/modules/pets/pets.module.ts");
const appointments_module_1 = __webpack_require__(/*! @modules/appointments/appointments.module */ "./src/modules/appointments/appointments.module.ts");
const health_records_module_1 = __webpack_require__(/*! @modules/health-records/health-records.module */ "./src/modules/health-records/health-records.module.ts");
const medications_module_1 = __webpack_require__(/*! @modules/medications/medications.module */ "./src/modules/medications/medications.module.ts");
const health_reminders_module_1 = __webpack_require__(/*! @modules/health-reminders/health-reminders.module */ "./src/modules/health-reminders/health-reminders.module.ts");
const consultations_module_1 = __webpack_require__(/*! @modules/consultations/consultations.module */ "./src/modules/consultations/consultations.module.ts");
const insurance_module_1 = __webpack_require__(/*! @modules/insurance/insurance.module */ "./src/modules/insurance/insurance.module.ts");
const symptom_checker_module_1 = __webpack_require__(/*! @modules/symptom-checker/symptom-checker.module */ "./src/modules/symptom-checker/symptom-checker.module.ts");
const forum_module_1 = __webpack_require__(/*! @modules/forum/forum.module */ "./src/modules/forum/forum.module.ts");
const notifications_module_1 = __webpack_require__(/*! @modules/notifications/notifications.module */ "./src/modules/notifications/notifications.module.ts");
const seed_module_1 = __webpack_require__(/*! @modules/seed/seed.module */ "./src/modules/seed/seed.module.ts");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [mongodb_config_1.MongodbConfig, redis_config_1.RedisConfig, cloudinary_config_1.CloudinaryConfig],
            }),
            mongoose_1.MongooseModule.forRootAsync({
                useFactory: () => ({
                    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/pawpromise',
                    maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE || '10'),
                    minPoolSize: parseInt(process.env.MONGODB_MIN_POOL_SIZE || '2'),
                    maxIdleTimeMS: parseInt(process.env.MONGODB_MAX_IDLE_TIME || '30000'),
                    serverSelectionTimeoutMS: parseInt(process.env.MONGODB_SERVER_SELECTION_TIMEOUT || '5000'),
                    socketTimeoutMS: parseInt(process.env.MONGODB_SOCKET_TIMEOUT || '45000'),
                }),
            }),
            bull_1.BullModule.forRootAsync({
                useFactory: () => ({
                    redis: {
                        host: process.env.REDIS_HOST || 'localhost',
                        port: parseInt(process.env.REDIS_PORT) || 6379,
                    },
                }),
            }),
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            pets_module_1.PetsModule,
            appointments_module_1.AppointmentsModule,
            health_records_module_1.HealthRecordsModule,
            medications_module_1.MedicationsModule,
            health_reminders_module_1.HealthRemindersModule,
            consultations_module_1.ConsultationsModule,
            insurance_module_1.InsuranceModule,
            symptom_checker_module_1.SymptomCheckerModule,
            forum_module_1.ForumModule,
            notifications_module_1.NotificationsModule,
            seed_module_1.SeedModule,
        ],
    })
], AppModule);


/***/ }),

/***/ "./src/common/utils/database-error.handler.ts":
/*!****************************************************!*\
  !*** ./src/common/utils/database-error.handler.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DatabaseErrorHandler = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
class DatabaseErrorHandler {
    static handle(error, operation = 'Database operation') {
        if (error.name === 'CastError') {
            throw new common_1.BadRequestException('Invalid ID format');
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err) => err.message);
            throw new common_1.BadRequestException(`Validation failed: ${messages.join(', ')}`);
        }
        if (error.code === 11000) {
            throw new common_1.BadRequestException('Duplicate entry found');
        }
        if (error.name === 'DocumentNotFoundError') {
            throw new common_1.NotFoundException('Resource not found');
        }
        console.error(`${operation} failed:`, error);
        throw new common_1.InternalServerErrorException(`${operation} failed`);
    }
}
exports.DatabaseErrorHandler = DatabaseErrorHandler;


/***/ }),

/***/ "./src/common/utils/mail.service.ts":
/*!******************************************!*\
  !*** ./src/common/utils/mail.service.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MailService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const nodemailer = __webpack_require__(/*! nodemailer */ "nodemailer");
let MailService = MailService_1 = class MailService {
    constructor() {
        this.logger = new common_1.Logger(MailService_1.name);
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.example.com',
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER || '',
                pass: process.env.SMTP_PASS || '',
            },
        });
    }
    async sendResetPassword(email, token) {
        const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';
        const resetUrl = `${frontend}/reset-password?token=${encodeURIComponent(token)}`;
        const mailOptions = {
            from: process.env.FROM_EMAIL || 'no-reply@PawMundo.app',
            to: email,
            subject: 'PawMundo — Password reset',
            html: `
        <p>You requested a password reset. Click the link below (expires in 10 minutes):</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>If you did not request this, ignore this email.</p>
      `,
        };
        try {
            const info = await this.transporter.sendMail(mailOptions);
            this.logger.log(`Reset email sent to ${email}: ${info.messageId}`);
            return info;
        }
        catch (err) {
            this.logger.error('Error sending reset email', err);
            throw err;
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MailService);


/***/ }),

/***/ "./src/common/utils/validation.util.ts":
/*!*********************************************!*\
  !*** ./src/common/utils/validation.util.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ValidationUtil = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
class ValidationUtil {
    static validateObjectId(id, fieldName = 'ID') {
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException(`Invalid ${fieldName} format`);
        }
    }
    static validateDate(dateString, fieldName = 'date') {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            throw new common_1.BadRequestException(`Invalid ${fieldName} format`);
        }
        return date;
    }
    static validateOptionalDate(dateString, fieldName = 'date') {
        if (!dateString)
            return undefined;
        return this.validateDate(dateString, fieldName);
    }
    static validatePort(portString, defaultPort) {
        if (!portString)
            return defaultPort;
        const port = parseInt(portString, 10);
        if (isNaN(port) || port < 1 || port > 65535) {
            return defaultPort;
        }
        return port;
    }
}
exports.ValidationUtil = ValidationUtil;


/***/ }),

/***/ "./src/config/cloudinary.config.ts":
/*!*****************************************!*\
  !*** ./src/config/cloudinary.config.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CloudinaryConfig = void 0;
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
exports.CloudinaryConfig = (0, config_1.registerAs)('cloudinary', () => ({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
}));


/***/ }),

/***/ "./src/config/mongodb.config.ts":
/*!**************************************!*\
  !*** ./src/config/mongodb.config.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MongodbConfig = void 0;
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
exports.MongodbConfig = (0, config_1.registerAs)('mongodb', () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error('MONGODB_URI environment variable is required');
    }
    return {
        uri,
        options: {
            maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE || '10'),
            minPoolSize: parseInt(process.env.MONGODB_MIN_POOL_SIZE || '2'),
            maxIdleTimeMS: parseInt(process.env.MONGODB_MAX_IDLE_TIME || '30000'),
            serverSelectionTimeoutMS: parseInt(process.env.MONGODB_SERVER_SELECTION_TIMEOUT || '5000'),
            socketTimeoutMS: parseInt(process.env.MONGODB_SOCKET_TIMEOUT || '45000'),
            bufferMaxEntries: 0,
            bufferCommands: false,
        }
    };
});


/***/ }),

/***/ "./src/config/redis.config.ts":
/*!************************************!*\
  !*** ./src/config/redis.config.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RedisConfig = void 0;
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
exports.RedisConfig = (0, config_1.registerAs)('redis', () => ({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD,
}));


/***/ }),

/***/ "./src/modules/appointments/appointments.controller.ts":
/*!*************************************************************!*\
  !*** ./src/modules/appointments/appointments.controller.ts ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppointmentsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
const appointments_service_1 = __webpack_require__(/*! ./appointments.service */ "./src/modules/appointments/appointments.service.ts");
const create_appointment_dto_1 = __webpack_require__(/*! ./dto/create-appointment.dto */ "./src/modules/appointments/dto/create-appointment.dto.ts");
const update_appointment_dto_1 = __webpack_require__(/*! ./dto/update-appointment.dto */ "./src/modules/appointments/dto/update-appointment.dto.ts");
let AppointmentsController = class AppointmentsController {
    constructor(appointmentsService) {
        this.appointmentsService = appointmentsService;
    }
    async create(req, createAppointmentDto) {
        return this.appointmentsService.create(req.user._id, createAppointmentDto);
    }
    async findMyAppointments(req) {
        return this.appointmentsService.findByUser(req.user._id);
    }
    async findUpcoming(req) {
        return this.appointmentsService.findUpcoming(req.user._id);
    }
    async findOne(id, req) {
        return this.appointmentsService.findById(id, req.user._id);
    }
    async update(id, updateAppointmentDto, req) {
        return this.appointmentsService.update(id, req.user._id, updateAppointmentDto);
    }
    async cancel(id, req) {
        return this.appointmentsService.cancel(id, req.user._id);
    }
    async remove(id, req) {
        return this.appointmentsService.delete(id, req.user._id);
    }
};
exports.AppointmentsController = AppointmentsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a new appointment' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Appointment created successfully' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_appointment_dto_1.CreateAppointmentDto !== "undefined" && create_appointment_dto_1.CreateAppointmentDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all user appointments' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of user appointments' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "findMyAppointments", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get upcoming appointments' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of upcoming appointments' }),
    (0, common_1.Get)('upcoming'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "findUpcoming", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get appointment by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointment details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Appointment not found' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update appointment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointment updated successfully' }),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof update_appointment_dto_1.UpdateAppointmentDto !== "undefined" && update_appointment_dto_1.UpdateAppointmentDto) === "function" ? _c : Object, Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Cancel appointment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointment cancelled successfully' }),
    (0, common_1.Put)(':id/cancel'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "cancel", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete appointment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointment deleted successfully' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "remove", null);
exports.AppointmentsController = AppointmentsController = __decorate([
    (0, swagger_1.ApiTags)('appointments'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('appointments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof appointments_service_1.AppointmentsService !== "undefined" && appointments_service_1.AppointmentsService) === "function" ? _a : Object])
], AppointmentsController);


/***/ }),

/***/ "./src/modules/appointments/appointments.module.ts":
/*!*********************************************************!*\
  !*** ./src/modules/appointments/appointments.module.ts ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppointmentsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const appointments_controller_1 = __webpack_require__(/*! ./appointments.controller */ "./src/modules/appointments/appointments.controller.ts");
const appointments_service_1 = __webpack_require__(/*! ./appointments.service */ "./src/modules/appointments/appointments.service.ts");
const appointment_schema_1 = __webpack_require__(/*! ./schemas/appointment.schema */ "./src/modules/appointments/schemas/appointment.schema.ts");
let AppointmentsModule = class AppointmentsModule {
};
exports.AppointmentsModule = AppointmentsModule;
exports.AppointmentsModule = AppointmentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: appointment_schema_1.Appointment.name, schema: appointment_schema_1.AppointmentSchema }])
        ],
        controllers: [appointments_controller_1.AppointmentsController],
        providers: [appointments_service_1.AppointmentsService],
        exports: [appointments_service_1.AppointmentsService]
    })
], AppointmentsModule);


/***/ }),

/***/ "./src/modules/appointments/appointments.service.ts":
/*!**********************************************************!*\
  !*** ./src/modules/appointments/appointments.service.ts ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppointmentsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const appointment_schema_1 = __webpack_require__(/*! ./schemas/appointment.schema */ "./src/modules/appointments/schemas/appointment.schema.ts");
let AppointmentsService = class AppointmentsService {
    constructor(appointmentModel) {
        this.appointmentModel = appointmentModel;
    }
    async create(userId, createAppointmentDto) {
        const appointment = new this.appointmentModel({
            ...createAppointmentDto,
            userId,
            appointmentDate: new Date(createAppointmentDto.appointmentDate)
        });
        return appointment.save();
    }
    async findByUser(userId) {
        return this.appointmentModel
            .find({ userId, isActive: true })
            .populate('petId', 'name species breed')
            .sort({ appointmentDate: 1 })
            .exec();
    }
    async findById(id, userId) {
        const appointment = await this.appointmentModel
            .findById(id)
            .populate('petId', 'name species breed')
            .exec();
        if (!appointment)
            throw new common_1.NotFoundException('Appointment not found');
        if (userId && appointment.userId.toString() !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return appointment;
    }
    async update(id, userId, updateAppointmentDto) {
        await this.findById(id, userId);
        const updateData = { ...updateAppointmentDto };
        if (updateAppointmentDto.appointmentDate) {
            updateData.appointmentDate = new Date(updateAppointmentDto.appointmentDate);
        }
        return this.appointmentModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .populate('petId', 'name species breed')
            .exec();
    }
    async cancel(id, userId) {
        await this.findById(id, userId);
        return this.appointmentModel
            .findByIdAndUpdate(id, { status: 'cancelled' }, { new: true })
            .populate('petId', 'name species breed')
            .exec();
    }
    async delete(id, userId) {
        await this.findById(id, userId);
        return this.appointmentModel
            .findByIdAndUpdate(id, { isActive: false }, { new: true })
            .exec();
    }
    async findUpcoming(userId) {
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
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(appointment_schema_1.Appointment.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], AppointmentsService);


/***/ }),

/***/ "./src/modules/appointments/dto/create-appointment.dto.ts":
/*!****************************************************************!*\
  !*** ./src/modules/appointments/dto/create-appointment.dto.ts ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateAppointmentDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class CreateAppointmentDto {
}
exports.CreateAppointmentDto = CreateAppointmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Pet ID' }),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "petId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Veterinarian name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "vetName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Veterinary clinic name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "vetClinic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Appointment date', example: '2024-01-15' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "appointmentDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Appointment time', example: '10:30 AM' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "appointmentTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reason for appointment' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Veterinarian phone number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "vetPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Veterinarian email' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "vetEmail", void 0);


/***/ }),

/***/ "./src/modules/appointments/dto/update-appointment.dto.ts":
/*!****************************************************************!*\
  !*** ./src/modules/appointments/dto/update-appointment.dto.ts ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateAppointmentDto = void 0;
const mapped_types_1 = __webpack_require__(/*! @nestjs/mapped-types */ "@nestjs/mapped-types");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const create_appointment_dto_1 = __webpack_require__(/*! ./create-appointment.dto */ "./src/modules/appointments/dto/create-appointment.dto.ts");
class UpdateAppointmentDto extends (0, mapped_types_1.PartialType)(create_appointment_dto_1.CreateAppointmentDto) {
}
exports.UpdateAppointmentDto = UpdateAppointmentDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Appointment status',
        enum: ['scheduled', 'confirmed', 'completed', 'cancelled']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['scheduled', 'confirmed', 'completed', 'cancelled']),
    __metadata("design:type", String)
], UpdateAppointmentDto.prototype, "status", void 0);


/***/ }),

/***/ "./src/modules/appointments/schemas/appointment.schema.ts":
/*!****************************************************************!*\
  !*** ./src/modules/appointments/schemas/appointment.schema.ts ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppointmentSchema = exports.Appointment = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
let Appointment = class Appointment {
};
exports.Appointment = Appointment;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", typeof (_a = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _a : Object)
], Appointment.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Pet', required: true }),
    __metadata("design:type", typeof (_b = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _b : Object)
], Appointment.prototype, "petId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Appointment.prototype, "vetName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Appointment.prototype, "vetClinic", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Appointment.prototype, "appointmentDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Appointment.prototype, "appointmentTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Appointment.prototype, "reason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'scheduled', enum: ['scheduled', 'confirmed', 'completed', 'cancelled'] }),
    __metadata("design:type", String)
], Appointment.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Appointment.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Appointment.prototype, "vetPhone", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Appointment.prototype, "vetEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Appointment.prototype, "isActive", void 0);
exports.Appointment = Appointment = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Appointment);
exports.AppointmentSchema = mongoose_1.SchemaFactory.createForClass(Appointment);


/***/ }),

/***/ "./src/modules/auth/auth.controller.ts":
/*!*********************************************!*\
  !*** ./src/modules/auth/auth.controller.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./src/modules/auth/auth.service.ts");
const register_dto_1 = __webpack_require__(/*! ./dto/register.dto */ "./src/modules/auth/dto/register.dto.ts");
const login_dto_1 = __webpack_require__(/*! ./dto/login.dto */ "./src/modules/auth/dto/login.dto.ts");
const forgot_password_dto_1 = __webpack_require__(/*! ./dto/forgot-password.dto */ "./src/modules/auth/dto/forgot-password.dto.ts");
const reset_password_dto_1 = __webpack_require__(/*! ./dto/reset-password.dto */ "./src/modules/auth/dto/reset-password.dto.ts");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(registerDto) {
        return this.authService.register(registerDto);
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
    getProfile(req) {
        return req.user;
    }
    async forgotPassword(forgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto);
    }
    async resetPassword(resetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof register_dto_1.RegisterDto !== "undefined" && register_dto_1.RegisterDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('local')),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof login_dto_1.LoginDto !== "undefined" && login_dto_1.LoginDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof forgot_password_dto_1.ForgotPasswordDto !== "undefined" && forgot_password_dto_1.ForgotPasswordDto) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof reset_password_dto_1.ResetPasswordDto !== "undefined" && reset_password_dto_1.ResetPasswordDto) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),

/***/ "./src/modules/auth/auth.module.ts":
/*!*****************************************!*\
  !*** ./src/modules/auth/auth.module.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./src/modules/auth/auth.service.ts");
const auth_controller_1 = __webpack_require__(/*! ./auth.controller */ "./src/modules/auth/auth.controller.ts");
const user_schema_1 = __webpack_require__(/*! ./schemas/user.schema */ "./src/modules/auth/schemas/user.schema.ts");
const jwt_strategy_1 = __webpack_require__(/*! ./strategies/jwt.strategy */ "./src/modules/auth/strategies/jwt.strategy.ts");
const local_strategy_1 = __webpack_require__(/*! ./strategies/local.strategy */ "./src/modules/auth/strategies/local.strategy.ts");
const mail_service_1 = __webpack_require__(/*! ../../common/utils/mail.service */ "./src/common/utils/mail.service.ts");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'your-secret-key',
                signOptions: { expiresIn: '24h' },
            }),
            mongoose_1.MongooseModule.forFeature([{ name: user_schema_1.User.name, schema: user_schema_1.UserSchema }]),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, local_strategy_1.LocalStrategy, mail_service_1.MailService],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);


/***/ }),

/***/ "./src/modules/auth/auth.service.ts":
/*!******************************************!*\
  !*** ./src/modules/auth/auth.service.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const bcrypt = __webpack_require__(/*! bcrypt */ "bcrypt");
const crypto = __webpack_require__(/*! crypto */ "crypto");
const user_schema_1 = __webpack_require__(/*! ./schemas/user.schema */ "./src/modules/auth/schemas/user.schema.ts");
const mail_service_1 = __webpack_require__(/*! ../../common/utils/mail.service */ "./src/common/utils/mail.service.ts");
const validation_util_1 = __webpack_require__(/*! ../../common/utils/validation.util */ "./src/common/utils/validation.util.ts");
const database_error_handler_1 = __webpack_require__(/*! ../../common/utils/database-error.handler */ "./src/common/utils/database-error.handler.ts");
let AuthService = class AuthService {
    constructor(userModel, jwtService, mailService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }
    async register(registerDto) {
        let user;
        try {
            const { email, password, firstName, lastName, phone, address } = registerDto;
            const existingUser = await this.userModel.findOne({ email });
            if (existingUser) {
                throw new common_1.ConflictException('User with this email already exists');
            }
            const hashedPassword = await bcrypt.hash(password, 12);
            const emailVerificationToken = crypto.randomBytes(32).toString('hex');
            user = new this.userModel({
                email,
                password: hashedPassword,
                firstName,
                lastName,
                phone,
                address,
                emailVerificationToken,
            });
            await user.save();
        }
        catch (error) {
            if (error instanceof common_1.ConflictException)
                throw error;
            database_error_handler_1.DatabaseErrorHandler.handle(error, 'User registration');
        }
        const payload = { email: user.email, sub: user._id };
        const token = this.jwtService.sign(payload);
        return {
            access_token: token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                isEmailVerified: user.isEmailVerified,
            },
        };
    }
    async login(loginDto) {
        try {
            const { email, password } = loginDto;
            const user = await this.validateUser(email, password);
            if (!user) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const lastLogin = new Date();
            await this.userModel.findByIdAndUpdate(user._id, { lastLogin });
            const payload = { email: user.email, sub: user._id };
            const token = this.jwtService.sign(payload);
            return {
                access_token: token,
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    isEmailVerified: user.isEmailVerified,
                    lastLogin,
                },
            };
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException)
                throw error;
            database_error_handler_1.DatabaseErrorHandler.handle(error, 'User login');
        }
    }
    async validateUser(email, password) {
        const user = await this.userModel.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user.toObject();
            return result;
        }
        return null;
    }
    async findById(id) {
        try {
            validation_util_1.ValidationUtil.validateObjectId(id, 'User ID');
            return this.userModel.findById(id).select('-password -emailVerificationToken -passwordResetToken');
        }
        catch (error) {
            database_error_handler_1.DatabaseErrorHandler.handle(error, 'Find user by ID');
        }
    }
    async forgotPassword(forgotPasswordDto) {
        const { email } = forgotPasswordDto;
        const user = await this.userModel.findOne({ email });
        if (!user) {
            return { message: 'If email exists, password reset link has been sent' };
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const resetExpires = new Date(Date.now() + 10 * 60 * 1000);
        await this.userModel.findByIdAndUpdate(user._id, {
            passwordResetToken: hashedToken,
            passwordResetExpires: resetExpires,
        });
        try {
            await this.mailService.sendResetPassword(user.email, resetToken);
        }
        catch (err) {
        }
        return { message: 'If email exists, password reset link has been sent' };
    }
    async resetPassword(resetPasswordDto) {
        try {
            const { token, newPassword } = resetPasswordDto;
            const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
            const user = await this.userModel.findOne({
                passwordResetToken: hashedToken,
                passwordResetExpires: { $gt: new Date() },
            });
            if (!user) {
                throw new common_1.BadRequestException('Invalid or expired reset token');
            }
            const hashedPassword = await bcrypt.hash(newPassword, 12);
            await this.userModel.findByIdAndUpdate(user._id, {
                password: hashedPassword,
                passwordResetToken: undefined,
                passwordResetExpires: undefined,
            });
            return { message: 'Password reset successfully' };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException)
                throw error;
            database_error_handler_1.DatabaseErrorHandler.handle(error, 'Password reset');
        }
    }
    async changePassword(userId, changePasswordDto) {
        try {
            validation_util_1.ValidationUtil.validateObjectId(userId, 'User ID');
            const { currentPassword, newPassword } = changePasswordDto;
            const user = await this.userModel.findById(userId);
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            if (!(await bcrypt.compare(currentPassword, user.password))) {
                throw new common_1.UnauthorizedException('Current password is incorrect');
            }
            const hashedPassword = await bcrypt.hash(newPassword, 12);
            await this.userModel.findByIdAndUpdate(userId, { password: hashedPassword });
            return { message: 'Password changed successfully' };
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException || error instanceof common_1.BadRequestException)
                throw error;
            database_error_handler_1.DatabaseErrorHandler.handle(error, 'Password change');
        }
    }
    async verifyEmail(token) {
        const user = await this.userModel.findOne({ emailVerificationToken: token });
        if (!user) {
            throw new common_1.BadRequestException('Invalid verification token');
        }
        await this.userModel.findByIdAndUpdate(user._id, {
            isEmailVerified: true,
            emailVerificationToken: undefined,
        });
        return { message: 'Email verified successfully' };
    }
    async updateProfile(userId, updateData) {
        try {
            validation_util_1.ValidationUtil.validateObjectId(userId, 'User ID');
            const allowedFields = ['firstName', 'lastName', 'phone', 'address', 'profileImage'];
            const filteredData = Object.keys(updateData)
                .filter(key => allowedFields.includes(key))
                .reduce((obj, key) => ({ ...obj, [key]: updateData[key] }), {});
            return this.userModel.findByIdAndUpdate(userId, filteredData, { new: true })
                .select('-password -emailVerificationToken -passwordResetToken');
        }
        catch (error) {
            database_error_handler_1.DatabaseErrorHandler.handle(error, 'Profile update');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object, typeof (_c = typeof mail_service_1.MailService !== "undefined" && mail_service_1.MailService) === "function" ? _c : Object])
], AuthService);


/***/ }),

/***/ "./src/modules/auth/dto/forgot-password.dto.ts":
/*!*****************************************************!*\
  !*** ./src/modules/auth/dto/forgot-password.dto.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ForgotPasswordDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class ForgotPasswordDto {
}
exports.ForgotPasswordDto = ForgotPasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email address for password reset' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ForgotPasswordDto.prototype, "email", void 0);


/***/ }),

/***/ "./src/modules/auth/dto/login.dto.ts":
/*!*******************************************!*\
  !*** ./src/modules/auth/dto/login.dto.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class LoginDto {
}
exports.LoginDto = LoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User email address', example: 'user@example.com' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User password' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);


/***/ }),

/***/ "./src/modules/auth/dto/register.dto.ts":
/*!**********************************************!*\
  !*** ./src/modules/auth/dto/register.dto.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegisterDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class RegisterDto {
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User email address', example: 'user@example.com' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Password (min 8 chars, must contain uppercase, lowercase, number)',
        minLength: 8
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'Password must contain uppercase, lowercase and number'
    }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'First name', example: 'John' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last name', example: 'Doe' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Phone number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Address' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "address", void 0);


/***/ }),

/***/ "./src/modules/auth/dto/reset-password.dto.ts":
/*!****************************************************!*\
  !*** ./src/modules/auth/dto/reset-password.dto.ts ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ResetPasswordDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class ResetPasswordDto {
}
exports.ResetPasswordDto = ResetPasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Password reset token' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'New password (min 8 chars, must contain uppercase, lowercase, number)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'Password must contain uppercase, lowercase and number'
    }),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "newPassword", void 0);


/***/ }),

/***/ "./src/modules/auth/guards/jwt-auth.guard.ts":
/*!***************************************************!*\
  !*** ./src/modules/auth/guards/jwt-auth.guard.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);


/***/ }),

/***/ "./src/modules/auth/schemas/user.schema.ts":
/*!*************************************************!*\
  !*** ./src/modules/auth/schemas/user.schema.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserSchema = exports.User = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
let User = class User {
};
exports.User = User;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'user', enum: ['user', 'vet', 'admin'] }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "profileImage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isEmailVerified", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "emailVerificationToken", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "passwordResetToken", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], User.prototype, "passwordResetExpires", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], User.prototype, "lastLogin", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
exports.User = User = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], User);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);


/***/ }),

/***/ "./src/modules/auth/strategies/jwt.strategy.ts":
/*!*****************************************************!*\
  !*** ./src/modules/auth/strategies/jwt.strategy.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const passport_jwt_1 = __webpack_require__(/*! passport-jwt */ "passport-jwt");
const auth_service_1 = __webpack_require__(/*! ../auth.service */ "./src/modules/auth/auth.service.ts");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(authService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
        });
        this.authService = authService;
    }
    async validate(payload) {
        const user = await this.authService.findById(payload.sub);
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        return user;
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], JwtStrategy);


/***/ }),

/***/ "./src/modules/auth/strategies/local.strategy.ts":
/*!*******************************************************!*\
  !*** ./src/modules/auth/strategies/local.strategy.ts ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalStrategy = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const passport_local_1 = __webpack_require__(/*! passport-local */ "passport-local");
const auth_service_1 = __webpack_require__(/*! ../auth.service */ "./src/modules/auth/auth.service.ts");
let LocalStrategy = class LocalStrategy extends (0, passport_1.PassportStrategy)(passport_local_1.Strategy) {
    constructor(authService) {
        super({ usernameField: 'email' });
        this.authService = authService;
    }
    async validate(email, password) {
        const user = await this.authService.validateUser(email, password);
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        return user;
    }
};
exports.LocalStrategy = LocalStrategy;
exports.LocalStrategy = LocalStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], LocalStrategy);


/***/ }),

/***/ "./src/modules/consultations/consultations.controller.ts":
/*!***************************************************************!*\
  !*** ./src/modules/consultations/consultations.controller.ts ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConsultationsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const consultations_service_1 = __webpack_require__(/*! ./consultations.service */ "./src/modules/consultations/consultations.service.ts");
const create_consultation_dto_1 = __webpack_require__(/*! ./dto/create-consultation.dto */ "./src/modules/consultations/dto/create-consultation.dto.ts");
const update_consultation_dto_1 = __webpack_require__(/*! ./dto/update-consultation.dto */ "./src/modules/consultations/dto/update-consultation.dto.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
let ConsultationsController = class ConsultationsController {
    constructor(consultationsService) {
        this.consultationsService = consultationsService;
    }
    create(req, createConsultationDto) {
        return this.consultationsService.create(req.user.userId, createConsultationDto);
    }
    findAll(req, status) {
        if (status) {
            return this.consultationsService.findByStatus(req.user.userId, status);
        }
        return this.consultationsService.findAll(req.user.userId);
    }
    getUpcoming(req) {
        return this.consultationsService.getUpcoming(req.user.userId);
    }
    findOne(id, req) {
        return this.consultationsService.findById(id, req.user.userId);
    }
    update(id, req, updateConsultationDto) {
        return this.consultationsService.update(id, req.user.userId, updateConsultationDto);
    }
    cancel(id, req) {
        return this.consultationsService.cancel(id, req.user.userId);
    }
    startConsultation(id, req, meetingLink) {
        return this.consultationsService.startConsultation(id, req.user.userId, meetingLink);
    }
    completeConsultation(id, req, notes, prescription) {
        return this.consultationsService.completeConsultation(id, req.user.userId, notes, prescription);
    }
};
exports.ConsultationsController = ConsultationsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_consultation_dto_1.CreateConsultationDto !== "undefined" && create_consultation_dto_1.CreateConsultationDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], ConsultationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ConsultationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('upcoming'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ConsultationsController.prototype, "getUpcoming", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ConsultationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_c = typeof update_consultation_dto_1.UpdateConsultationDto !== "undefined" && update_consultation_dto_1.UpdateConsultationDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], ConsultationsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ConsultationsController.prototype, "cancel", null);
__decorate([
    (0, common_1.Patch)(':id/start'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)('meetingLink')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", void 0)
], ConsultationsController.prototype, "startConsultation", null);
__decorate([
    (0, common_1.Patch)(':id/complete'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)('notes')),
    __param(3, (0, common_1.Body)('prescription')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String]),
    __metadata("design:returntype", void 0)
], ConsultationsController.prototype, "completeConsultation", null);
exports.ConsultationsController = ConsultationsController = __decorate([
    (0, common_1.Controller)('consultations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof consultations_service_1.ConsultationsService !== "undefined" && consultations_service_1.ConsultationsService) === "function" ? _a : Object])
], ConsultationsController);


/***/ }),

/***/ "./src/modules/consultations/consultations.module.ts":
/*!***********************************************************!*\
  !*** ./src/modules/consultations/consultations.module.ts ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConsultationsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const consultations_service_1 = __webpack_require__(/*! ./consultations.service */ "./src/modules/consultations/consultations.service.ts");
const consultations_controller_1 = __webpack_require__(/*! ./consultations.controller */ "./src/modules/consultations/consultations.controller.ts");
const consultation_schema_1 = __webpack_require__(/*! ./schemas/consultation.schema */ "./src/modules/consultations/schemas/consultation.schema.ts");
const pets_module_1 = __webpack_require__(/*! ../pets/pets.module */ "./src/modules/pets/pets.module.ts");
let ConsultationsModule = class ConsultationsModule {
};
exports.ConsultationsModule = ConsultationsModule;
exports.ConsultationsModule = ConsultationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: consultation_schema_1.Consultation.name, schema: consultation_schema_1.ConsultationSchema }]),
            pets_module_1.PetsModule,
        ],
        controllers: [consultations_controller_1.ConsultationsController],
        providers: [consultations_service_1.ConsultationsService],
        exports: [consultations_service_1.ConsultationsService],
    })
], ConsultationsModule);


/***/ }),

/***/ "./src/modules/consultations/consultations.service.ts":
/*!************************************************************!*\
  !*** ./src/modules/consultations/consultations.service.ts ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConsultationsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const consultation_schema_1 = __webpack_require__(/*! ./schemas/consultation.schema */ "./src/modules/consultations/schemas/consultation.schema.ts");
const pets_service_1 = __webpack_require__(/*! ../pets/pets.service */ "./src/modules/pets/pets.service.ts");
let ConsultationsService = class ConsultationsService {
    constructor(consultationModel, petsService) {
        this.consultationModel = consultationModel;
        this.petsService = petsService;
    }
    async create(userId, createConsultationDto) {
        await this.petsService.findById(createConsultationDto.petId, userId);
        const consultation = new this.consultationModel({
            ...createConsultationDto,
            userId: new mongoose_2.Types.ObjectId(userId),
            petId: new mongoose_2.Types.ObjectId(createConsultationDto.petId),
            status: 'scheduled',
            scheduledDate: new Date(createConsultationDto.scheduledDate),
        });
        return consultation.save();
    }
    async findAll(userId) {
        return this.consultationModel
            .find({ userId: new mongoose_2.Types.ObjectId(userId), isActive: true })
            .populate('petId', 'name species')
            .sort({ scheduledDate: -1 });
    }
    async findByStatus(userId, status) {
        return this.consultationModel
            .find({ userId: new mongoose_2.Types.ObjectId(userId), status, isActive: true })
            .populate('petId', 'name species')
            .sort({ scheduledDate: -1 });
    }
    async findById(id, userId) {
        const consultation = await this.consultationModel
            .findOne({ _id: id, userId: new mongoose_2.Types.ObjectId(userId), isActive: true })
            .populate('petId');
        if (!consultation) {
            throw new common_1.NotFoundException('Consultation not found');
        }
        return consultation;
    }
    async update(id, userId, updateConsultationDto) {
        await this.findById(id, userId);
        const updateData = { ...updateConsultationDto };
        if (updateConsultationDto.followUpDate) {
            updateData.followUpDate = new Date(updateConsultationDto.followUpDate);
        }
        return this.consultationModel.findByIdAndUpdate(id, updateData, { new: true });
    }
    async cancel(id, userId) {
        return this.update(id, userId, { status: 'cancelled' });
    }
    async startConsultation(id, userId, meetingLink) {
        return this.update(id, userId, {
            status: 'in-progress',
            meetingLink,
            meetingId: `meeting_${id}_${Date.now()}`
        });
    }
    async completeConsultation(id, userId, notes, prescription) {
        return this.update(id, userId, {
            status: 'completed',
            notes,
            prescription
        });
    }
    async getUpcoming(userId) {
        const now = new Date();
        return this.consultationModel
            .find({
            userId: new mongoose_2.Types.ObjectId(userId),
            status: 'scheduled',
            scheduledDate: { $gte: now },
            isActive: true
        })
            .populate('petId', 'name species')
            .sort({ scheduledDate: 1 })
            .limit(5);
    }
};
exports.ConsultationsService = ConsultationsService;
exports.ConsultationsService = ConsultationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(consultation_schema_1.Consultation.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof pets_service_1.PetsService !== "undefined" && pets_service_1.PetsService) === "function" ? _b : Object])
], ConsultationsService);


/***/ }),

/***/ "./src/modules/consultations/dto/create-consultation.dto.ts":
/*!******************************************************************!*\
  !*** ./src/modules/consultations/dto/create-consultation.dto.ts ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateConsultationDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class CreateConsultationDto {
}
exports.CreateConsultationDto = CreateConsultationDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateConsultationDto.prototype, "petId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateConsultationDto.prototype, "veterinarianId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateConsultationDto.prototype, "veterinarianName", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateConsultationDto.prototype, "scheduledDate", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateConsultationDto.prototype, "duration", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateConsultationDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateConsultationDto.prototype, "symptoms", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['video', 'audio', 'chat']),
    __metadata("design:type", String)
], CreateConsultationDto.prototype, "consultationType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateConsultationDto.prototype, "cost", void 0);


/***/ }),

/***/ "./src/modules/consultations/dto/update-consultation.dto.ts":
/*!******************************************************************!*\
  !*** ./src/modules/consultations/dto/update-consultation.dto.ts ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateConsultationDto = void 0;
const mapped_types_1 = __webpack_require__(/*! @nestjs/mapped-types */ "@nestjs/mapped-types");
const create_consultation_dto_1 = __webpack_require__(/*! ./create-consultation.dto */ "./src/modules/consultations/dto/create-consultation.dto.ts");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class UpdateConsultationDto extends (0, mapped_types_1.PartialType)(create_consultation_dto_1.CreateConsultationDto) {
}
exports.UpdateConsultationDto = UpdateConsultationDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['scheduled', 'in-progress', 'completed', 'cancelled']),
    __metadata("design:type", String)
], UpdateConsultationDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateConsultationDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateConsultationDto.prototype, "prescription", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateConsultationDto.prototype, "followUpRequired", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateConsultationDto.prototype, "followUpDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateConsultationDto.prototype, "meetingLink", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateConsultationDto.prototype, "meetingId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['pending', 'paid', 'refunded']),
    __metadata("design:type", String)
], UpdateConsultationDto.prototype, "paymentStatus", void 0);


/***/ }),

/***/ "./src/modules/consultations/schemas/consultation.schema.ts":
/*!******************************************************************!*\
  !*** ./src/modules/consultations/schemas/consultation.schema.ts ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConsultationSchema = exports.Consultation = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
let Consultation = class Consultation {
};
exports.Consultation = Consultation;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", typeof (_a = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _a : Object)
], Consultation.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Pet', required: true }),
    __metadata("design:type", typeof (_b = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _b : Object)
], Consultation.prototype, "petId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Consultation.prototype, "veterinarianId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Consultation.prototype, "veterinarianName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['scheduled', 'in-progress', 'completed', 'cancelled'] }),
    __metadata("design:type", String)
], Consultation.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Consultation.prototype, "scheduledDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Consultation.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Consultation.prototype, "reason", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Consultation.prototype, "symptoms", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Consultation.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Consultation.prototype, "prescription", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], Consultation.prototype, "followUpRequired", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], Consultation.prototype, "followUpDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['video', 'audio', 'chat'] }),
    __metadata("design:type", String)
], Consultation.prototype, "consultationType", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Consultation.prototype, "meetingLink", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Consultation.prototype, "meetingId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Consultation.prototype, "cost", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'pending', enum: ['pending', 'paid', 'refunded'] }),
    __metadata("design:type", String)
], Consultation.prototype, "paymentStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Consultation.prototype, "isActive", void 0);
exports.Consultation = Consultation = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Consultation);
exports.ConsultationSchema = mongoose_1.SchemaFactory.createForClass(Consultation);


/***/ }),

/***/ "./src/modules/forum/dto/create-forum-post.dto.ts":
/*!********************************************************!*\
  !*** ./src/modules/forum/dto/create-forum-post.dto.ts ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateForumPostDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class CreateForumPostDto {
}
exports.CreateForumPostDto = CreateForumPostDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Post title' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateForumPostDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Post content' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateForumPostDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Post category',
        enum: ['general', 'health', 'training', 'nutrition', 'behavior']
    }),
    (0, class_validator_1.IsEnum)(['general', 'health', 'training', 'nutrition', 'behavior']),
    __metadata("design:type", String)
], CreateForumPostDto.prototype, "category", void 0);


/***/ }),

/***/ "./src/modules/forum/dto/create-reply.dto.ts":
/*!***************************************************!*\
  !*** ./src/modules/forum/dto/create-reply.dto.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateReplyDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class CreateReplyDto {
}
exports.CreateReplyDto = CreateReplyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reply content' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateReplyDto.prototype, "content", void 0);


/***/ }),

/***/ "./src/modules/forum/forum.controller.ts":
/*!***********************************************!*\
  !*** ./src/modules/forum/forum.controller.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ForumController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
const forum_service_1 = __webpack_require__(/*! ./forum.service */ "./src/modules/forum/forum.service.ts");
const create_forum_post_dto_1 = __webpack_require__(/*! ./dto/create-forum-post.dto */ "./src/modules/forum/dto/create-forum-post.dto.ts");
const create_reply_dto_1 = __webpack_require__(/*! ./dto/create-reply.dto */ "./src/modules/forum/dto/create-reply.dto.ts");
let ForumController = class ForumController {
    constructor(forumService) {
        this.forumService = forumService;
    }
    async create(req, createForumPostDto) {
        return this.forumService.create(createForumPostDto, req.user._id);
    }
    async findAll(category, page, limit) {
        return this.forumService.findAll(category, parseInt(page) || 1, parseInt(limit) || 10);
    }
    async findOne(id) {
        return this.forumService.findById(id);
    }
    async toggleLike(id, req) {
        return this.forumService.toggleLike(id, req.user._id);
    }
    async addReply(id, createReplyDto, req) {
        return this.forumService.addReply(id, createReplyDto, req.user._id);
    }
    async remove(id, req) {
        return this.forumService.delete(id, req.user._id);
    }
};
exports.ForumController = ForumController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a new forum post' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Post created successfully' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_forum_post_dto_1.CreateForumPostDto !== "undefined" && create_forum_post_dto_1.CreateForumPostDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all forum posts' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of forum posts' }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get forum post by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Forum post details' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Toggle like on a forum post' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Like toggled successfully' }),
    (0, common_1.Post)(':id/like'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "toggleLike", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Add reply to a forum post' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Reply added successfully' }),
    (0, common_1.Post)(':id/replies'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof create_reply_dto_1.CreateReplyDto !== "undefined" && create_reply_dto_1.CreateReplyDto) === "function" ? _c : Object, Object]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "addReply", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete forum post' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Post deleted successfully' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ForumController.prototype, "remove", null);
exports.ForumController = ForumController = __decorate([
    (0, swagger_1.ApiTags)('forum'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('forum'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof forum_service_1.ForumService !== "undefined" && forum_service_1.ForumService) === "function" ? _a : Object])
], ForumController);


/***/ }),

/***/ "./src/modules/forum/forum.module.ts":
/*!*******************************************!*\
  !*** ./src/modules/forum/forum.module.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ForumModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const forum_controller_1 = __webpack_require__(/*! ./forum.controller */ "./src/modules/forum/forum.controller.ts");
const forum_service_1 = __webpack_require__(/*! ./forum.service */ "./src/modules/forum/forum.service.ts");
const forum_post_schema_1 = __webpack_require__(/*! ./schemas/forum-post.schema */ "./src/modules/forum/schemas/forum-post.schema.ts");
let ForumModule = class ForumModule {
};
exports.ForumModule = ForumModule;
exports.ForumModule = ForumModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: forum_post_schema_1.ForumPost.name, schema: forum_post_schema_1.ForumPostSchema }]),
        ],
        controllers: [forum_controller_1.ForumController],
        providers: [forum_service_1.ForumService],
        exports: [forum_service_1.ForumService],
    })
], ForumModule);


/***/ }),

/***/ "./src/modules/forum/forum.service.ts":
/*!********************************************!*\
  !*** ./src/modules/forum/forum.service.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ForumService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const forum_post_schema_1 = __webpack_require__(/*! ./schemas/forum-post.schema */ "./src/modules/forum/schemas/forum-post.schema.ts");
let ForumService = class ForumService {
    constructor(forumPostModel) {
        this.forumPostModel = forumPostModel;
    }
    async create(createForumPostDto, authorId) {
        const post = new this.forumPostModel({
            ...createForumPostDto,
            authorId: new mongoose_2.Types.ObjectId(authorId),
        });
        return post.save();
    }
    async findAll(category, page = 1, limit = 10) {
        const filter = { isActive: true };
        if (category)
            filter.category = category;
        const skip = (page - 1) * limit;
        const [posts, total] = await Promise.all([
            this.forumPostModel
                .find(filter)
                .populate('authorId', 'name email')
                .populate('replies.authorId', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.forumPostModel.countDocuments(filter),
        ]);
        return { posts, total };
    }
    async findById(id) {
        const post = await this.forumPostModel
            .findOneAndUpdate({ _id: id, isActive: true }, { $inc: { viewCount: 1 } }, { new: true })
            .populate('authorId', 'name email')
            .populate('replies.authorId', 'name email')
            .exec();
        if (!post) {
            throw new common_1.NotFoundException('Forum post not found');
        }
        return post;
    }
    async toggleLike(postId, userId) {
        const userObjectId = new mongoose_2.Types.ObjectId(userId);
        const post = await this.forumPostModel.findById(postId);
        if (!post) {
            throw new common_1.NotFoundException('Forum post not found');
        }
        const likeIndex = post.likes.findIndex(id => id.equals(userObjectId));
        if (likeIndex > -1) {
            post.likes.splice(likeIndex, 1);
        }
        else {
            post.likes.push(userObjectId);
        }
        return post.save();
    }
    async addReply(postId, createReplyDto, authorId) {
        const post = await this.forumPostModel.findById(postId);
        if (!post) {
            throw new common_1.NotFoundException('Forum post not found');
        }
        post.replies.push({
            content: createReplyDto.content,
            authorId: new mongoose_2.Types.ObjectId(authorId),
            createdAt: new Date(),
        });
        return post.save();
    }
    async update(id, updateForumPostDto, userId) {
        const post = await this.forumPostModel.findById(id);
        if (!post) {
            throw new common_1.NotFoundException('Forum post not found');
        }
        if (!post.authorId.equals(new mongoose_2.Types.ObjectId(userId))) {
            throw new common_1.ForbiddenException('You can only edit your own posts');
        }
        Object.assign(post, updateForumPostDto);
        return post.save();
    }
    async search(query, category, page = 1, limit = 10) {
        const filter = {
            isActive: true,
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } }
            ]
        };
        if (category)
            filter.category = category;
        const skip = (page - 1) * limit;
        const [posts, total] = await Promise.all([
            this.forumPostModel
                .find(filter)
                .populate('authorId', 'name email')
                .populate('replies.authorId', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.forumPostModel.countDocuments(filter),
        ]);
        return { posts, total };
    }
    async getPopularPosts(limit = 10) {
        return this.forumPostModel
            .find({ isActive: true })
            .populate('authorId', 'name email')
            .sort({ likes: -1, viewCount: -1 })
            .limit(limit)
            .exec();
    }
    async getUserPosts(userId, page = 1, limit = 10) {
        const filter = { authorId: new mongoose_2.Types.ObjectId(userId), isActive: true };
        const skip = (page - 1) * limit;
        const [posts, total] = await Promise.all([
            this.forumPostModel
                .find(filter)
                .populate('authorId', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.forumPostModel.countDocuments(filter),
        ]);
        return { posts, total };
    }
    async delete(id, userId) {
        const post = await this.forumPostModel.findById(id);
        if (!post) {
            throw new common_1.NotFoundException('Forum post not found');
        }
        if (!post.authorId.equals(new mongoose_2.Types.ObjectId(userId))) {
            throw new common_1.ForbiddenException('You can only delete your own posts');
        }
        post.isActive = false;
        await post.save();
    }
};
exports.ForumService = ForumService;
exports.ForumService = ForumService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(forum_post_schema_1.ForumPost.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], ForumService);


/***/ }),

/***/ "./src/modules/forum/schemas/forum-post.schema.ts":
/*!********************************************************!*\
  !*** ./src/modules/forum/schemas/forum-post.schema.ts ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ForumPostSchema = exports.ForumPost = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
let ForumPost = class ForumPost extends mongoose_2.Document {
};
exports.ForumPost = ForumPost;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ForumPost.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ForumPost.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['general', 'health', 'training', 'nutrition', 'behavior'] }),
    __metadata("design:type", String)
], ForumPost.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", typeof (_a = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _a : Object)
], ForumPost.prototype, "authorId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: 'User' }], default: [] }),
    __metadata("design:type", Array)
], ForumPost.prototype, "likes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], ForumPost.prototype, "viewCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ForumPost.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)([{
            content: { type: String, required: true },
            authorId: { type: mongoose_2.Types.ObjectId, ref: 'User', required: true },
            createdAt: { type: Date, default: Date.now }
        }]),
    __metadata("design:type", typeof (_b = typeof Array !== "undefined" && Array) === "function" ? _b : Object)
], ForumPost.prototype, "replies", void 0);
exports.ForumPost = ForumPost = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ForumPost);
exports.ForumPostSchema = mongoose_1.SchemaFactory.createForClass(ForumPost);
exports.ForumPostSchema.index({ category: 1, isActive: 1, createdAt: -1 });
exports.ForumPostSchema.index({ authorId: 1, isActive: 1 });


/***/ }),

/***/ "./src/modules/health-records/dto/create-health-record.dto.ts":
/*!********************************************************************!*\
  !*** ./src/modules/health-records/dto/create-health-record.dto.ts ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateHealthRecordDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class CreateHealthRecordDto {
}
exports.CreateHealthRecordDto = CreateHealthRecordDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Pet ID' }),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateHealthRecordDto.prototype, "petId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Record type',
        enum: ['vaccination', 'checkup', 'surgery', 'medication', 'treatment', 'emergency', 'other']
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(['vaccination', 'checkup', 'surgery', 'medication', 'treatment', 'emergency', 'other']),
    __metadata("design:type", String)
], CreateHealthRecordDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Record title', example: 'Annual Vaccination' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateHealthRecordDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Detailed description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHealthRecordDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Record date', example: '2024-01-15' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateHealthRecordDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Veterinarian name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHealthRecordDto.prototype, "veterinarian", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Clinic name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHealthRecordDto.prototype, "clinic", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Attachment URLs' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateHealthRecordDto.prototype, "attachments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Next due date for follow-up' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateHealthRecordDto.prototype, "nextDueDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Pet weight in kg' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateHealthRecordDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Body temperature in Celsius' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateHealthRecordDto.prototype, "temperature", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Heart rate (BPM)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateHealthRecordDto.prototype, "heartRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cost of treatment' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateHealthRecordDto.prototype, "cost", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHealthRecordDto.prototype, "notes", void 0);


/***/ }),

/***/ "./src/modules/health-records/dto/update-health-record.dto.ts":
/*!********************************************************************!*\
  !*** ./src/modules/health-records/dto/update-health-record.dto.ts ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateHealthRecordDto = void 0;
const mapped_types_1 = __webpack_require__(/*! @nestjs/mapped-types */ "@nestjs/mapped-types");
const create_health_record_dto_1 = __webpack_require__(/*! ./create-health-record.dto */ "./src/modules/health-records/dto/create-health-record.dto.ts");
class UpdateHealthRecordDto extends (0, mapped_types_1.PartialType)(create_health_record_dto_1.CreateHealthRecordDto) {
}
exports.UpdateHealthRecordDto = UpdateHealthRecordDto;


/***/ }),

/***/ "./src/modules/health-records/health-records.controller.ts":
/*!*****************************************************************!*\
  !*** ./src/modules/health-records/health-records.controller.ts ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HealthRecordsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
const health_records_service_1 = __webpack_require__(/*! ./health-records.service */ "./src/modules/health-records/health-records.service.ts");
const create_health_record_dto_1 = __webpack_require__(/*! ./dto/create-health-record.dto */ "./src/modules/health-records/dto/create-health-record.dto.ts");
const update_health_record_dto_1 = __webpack_require__(/*! ./dto/update-health-record.dto */ "./src/modules/health-records/dto/update-health-record.dto.ts");
let HealthRecordsController = class HealthRecordsController {
    constructor(healthRecordsService) {
        this.healthRecordsService = healthRecordsService;
    }
    async create(req, createDto) {
        const healthRecordData = {
            ...createDto,
            petId: new mongoose_1.Types.ObjectId(createDto.petId),
            date: new Date(createDto.date),
            nextDueDate: createDto.nextDueDate ? new Date(createDto.nextDueDate) : undefined
        };
        return this.healthRecordsService.create(req.user._id, healthRecordData);
    }
    async findByPet(petId, type, req) {
        return this.healthRecordsService.findByPet(petId, req.user._id, type);
    }
    async getUpcomingReminders(req) {
        return this.healthRecordsService.getUpcomingReminders(req.user._id);
    }
    async getVaccinations(petId, req) {
        return this.healthRecordsService.getVaccinations(petId, req.user._id);
    }
    async getHealthSummary(petId, req) {
        return this.healthRecordsService.getHealthSummary(petId, req.user._id);
    }
    async findOne(id, req) {
        return this.healthRecordsService.findById(id, req.user._id);
    }
    async update(id, updateDto, req) {
        const healthRecordData = { ...updateDto };
        if (updateDto.petId) {
            healthRecordData.petId = new mongoose_1.Types.ObjectId(updateDto.petId);
        }
        if (updateDto.date) {
            healthRecordData.date = new Date(updateDto.date);
        }
        if (updateDto.nextDueDate) {
            healthRecordData.nextDueDate = new Date(updateDto.nextDueDate);
        }
        return this.healthRecordsService.update(id, req.user._id, healthRecordData);
    }
    async remove(id, req) {
        return this.healthRecordsService.delete(id, req.user._id);
    }
    async getOverdueReminders(req) {
        return this.healthRecordsService.getOverdueReminders(req.user._id);
    }
    async addAttachment(id, url, req) {
        return this.healthRecordsService.addAttachment(id, req.user._id, url);
    }
    async removeAttachment(id, url, req) {
        return this.healthRecordsService.removeAttachment(id, req.user._id, url);
    }
    async getRecordsByDateRange(petId, startDate, endDate, req) {
        return this.healthRecordsService.getRecordsByDateRange(petId, req.user._id, new Date(startDate), new Date(endDate));
    }
    async getHealthAnalytics(req) {
        return this.healthRecordsService.getHealthAnalytics(req.user._id);
    }
};
exports.HealthRecordsController = HealthRecordsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create health record' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Health record created successfully' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_health_record_dto_1.CreateHealthRecordDto !== "undefined" && create_health_record_dto_1.CreateHealthRecordDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], HealthRecordsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get health records by pet' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of pet health records' }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, description: 'Filter by record type' }),
    (0, common_1.Get)('pet/:petId'),
    __param(0, (0, common_1.Param)('petId')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], HealthRecordsController.prototype, "findByPet", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get upcoming reminders' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of upcoming health reminders' }),
    (0, common_1.Get)('reminders/upcoming'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HealthRecordsController.prototype, "getUpcomingReminders", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get vaccination history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vaccination records for pet' }),
    (0, common_1.Get)('pet/:petId/vaccinations'),
    __param(0, (0, common_1.Param)('petId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HealthRecordsController.prototype, "getVaccinations", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get health summary for pet' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Health summary statistics' }),
    (0, common_1.Get)('pet/:petId/summary'),
    __param(0, (0, common_1.Param)('petId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HealthRecordsController.prototype, "getHealthSummary", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get health record by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Health record details' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HealthRecordsController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update health record' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Health record updated successfully' }),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof update_health_record_dto_1.UpdateHealthRecordDto !== "undefined" && update_health_record_dto_1.UpdateHealthRecordDto) === "function" ? _c : Object, Object]),
    __metadata("design:returntype", Promise)
], HealthRecordsController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete health record' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Health record deleted successfully' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HealthRecordsController.prototype, "remove", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get overdue reminders' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of overdue health reminders' }),
    (0, common_1.Get)('reminders/overdue'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HealthRecordsController.prototype, "getOverdueReminders", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Add attachment to health record' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attachment added successfully' }),
    (0, common_1.Post)(':id/attachments'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('url')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], HealthRecordsController.prototype, "addAttachment", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Remove attachment from health record' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attachment removed successfully' }),
    (0, common_1.Delete)(':id/attachments'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('url')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], HealthRecordsController.prototype, "removeAttachment", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get health records by date range' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Health records within date range' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: true, description: 'Start date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: true, description: 'End date (YYYY-MM-DD)' }),
    (0, common_1.Get)('pet/:petId/date-range'),
    __param(0, (0, common_1.Param)('petId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], HealthRecordsController.prototype, "getRecordsByDateRange", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get health analytics for user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Health analytics and statistics' }),
    (0, common_1.Get)('analytics'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HealthRecordsController.prototype, "getHealthAnalytics", null);
exports.HealthRecordsController = HealthRecordsController = __decorate([
    (0, swagger_1.ApiTags)('health-records'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('health-records'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof health_records_service_1.HealthRecordsService !== "undefined" && health_records_service_1.HealthRecordsService) === "function" ? _a : Object])
], HealthRecordsController);


/***/ }),

/***/ "./src/modules/health-records/health-records.module.ts":
/*!*************************************************************!*\
  !*** ./src/modules/health-records/health-records.module.ts ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HealthRecordsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const health_records_controller_1 = __webpack_require__(/*! ./health-records.controller */ "./src/modules/health-records/health-records.controller.ts");
const health_records_service_1 = __webpack_require__(/*! ./health-records.service */ "./src/modules/health-records/health-records.service.ts");
const health_record_schema_1 = __webpack_require__(/*! ./schemas/health-record.schema */ "./src/modules/health-records/schemas/health-record.schema.ts");
const pets_module_1 = __webpack_require__(/*! ../pets/pets.module */ "./src/modules/pets/pets.module.ts");
let HealthRecordsModule = class HealthRecordsModule {
};
exports.HealthRecordsModule = HealthRecordsModule;
exports.HealthRecordsModule = HealthRecordsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: health_record_schema_1.HealthRecord.name, schema: health_record_schema_1.HealthRecordSchema }]),
            pets_module_1.PetsModule,
        ],
        controllers: [health_records_controller_1.HealthRecordsController],
        providers: [health_records_service_1.HealthRecordsService],
        exports: [health_records_service_1.HealthRecordsService],
    })
], HealthRecordsModule);


/***/ }),

/***/ "./src/modules/health-records/health-records.service.ts":
/*!**************************************************************!*\
  !*** ./src/modules/health-records/health-records.service.ts ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HealthRecordsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const health_record_schema_1 = __webpack_require__(/*! ./schemas/health-record.schema */ "./src/modules/health-records/schemas/health-record.schema.ts");
const pets_service_1 = __webpack_require__(/*! ../pets/pets.service */ "./src/modules/pets/pets.service.ts");
let HealthRecordsService = class HealthRecordsService {
    constructor(healthRecordModel, petsService) {
        this.healthRecordModel = healthRecordModel;
        this.petsService = petsService;
    }
    async create(userId, recordData) {
        await this.petsService.findById(recordData.petId.toString(), userId);
        const processedData = {
            ...recordData,
            date: new Date(recordData.date),
            nextDueDate: recordData.nextDueDate ? new Date(recordData.nextDueDate) : undefined
        };
        const record = new this.healthRecordModel(processedData);
        return record.save();
    }
    async findByPet(petId, userId, type) {
        await this.petsService.findById(petId, userId);
        const filter = { petId, isActive: true };
        if (type)
            filter.type = type;
        return this.healthRecordModel.find(filter).sort({ date: -1 }).exec();
    }
    async findById(id, userId) {
        const record = await this.healthRecordModel.findById(id).populate({
            path: 'petId',
            match: { ownerId: userId, isActive: true }
        }).exec();
        if (!record || !record.petId)
            throw new common_1.NotFoundException('Health record not found');
        return record;
    }
    async update(id, userId, updateData) {
        await this.findById(id, userId);
        return this.healthRecordModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }
    async delete(id, userId) {
        await this.findById(id, userId);
        return this.healthRecordModel.findByIdAndUpdate(id, { isActive: false }, { new: true }).exec();
    }
    async getUpcomingReminders(userId) {
        const today = new Date();
        const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
        return this.healthRecordModel
            .find({
            nextDueDate: { $gte: today, $lte: nextMonth },
            isActive: true
        })
            .populate({
            path: 'petId',
            match: { ownerId: userId, isActive: true },
            select: 'name species breed'
        })
            .sort({ nextDueDate: 1 })
            .exec()
            .then(records => records.filter(r => r.petId));
    }
    async getVaccinations(petId, userId) {
        await this.petsService.findById(petId, userId);
        return this.healthRecordModel
            .find({ petId, type: 'vaccination', isActive: true })
            .sort({ date: -1 })
            .exec();
    }
    async getHealthSummary(petId, userId) {
        const [pet, records] = await Promise.all([
            this.petsService.findById(petId, userId),
            this.healthRecordModel.find({ petId, isActive: true }).sort({ date: -1 }).exec()
        ]);
        const now = new Date();
        let upcomingCount = 0, overdueCount = 0, totalCost = 0;
        let nextReminder;
        const recordsByType = {};
        const weightHistory = [];
        let lastCheckup;
        for (const record of records) {
            recordsByType[record.type] = (recordsByType[record.type] || 0) + 1;
            totalCost += record.cost || 0;
            if (record.type === 'checkup' && !lastCheckup)
                lastCheckup = record.date;
            if (record.weight)
                weightHistory.push({ date: record.date, weight: record.weight });
            if (record.nextDueDate) {
                if (record.nextDueDate > now) {
                    upcomingCount++;
                    if (!nextReminder || record.nextDueDate < nextReminder) {
                        nextReminder = record.nextDueDate;
                    }
                }
                else {
                    overdueCount++;
                }
            }
        }
        return {
            totalRecords: records.length,
            recordsByType,
            lastCheckup,
            nextReminder,
            upcomingCount,
            overdueCount,
            totalCost,
            weightHistory: weightHistory.sort((a, b) => a.date.getTime() - b.date.getTime())
        };
    }
    async getOverdueReminders(userId) {
        const today = new Date();
        return this.healthRecordModel
            .find({
            nextDueDate: { $lt: today },
            isActive: true
        })
            .populate({
            path: 'petId',
            match: { ownerId: userId, isActive: true },
            select: 'name species breed'
        })
            .sort({ nextDueDate: 1 })
            .exec()
            .then(records => records.filter(r => r.petId));
    }
    async addAttachment(recordId, userId, attachmentUrl) {
        const record = await this.findById(recordId, userId);
        return this.healthRecordModel
            .findByIdAndUpdate(recordId, { $push: { attachments: attachmentUrl } }, { new: true })
            .exec();
    }
    async removeAttachment(recordId, userId, attachmentUrl) {
        const record = await this.findById(recordId, userId);
        return this.healthRecordModel
            .findByIdAndUpdate(recordId, { $pull: { attachments: attachmentUrl } }, { new: true })
            .exec();
    }
    async getRecordsByDateRange(petId, userId, startDate, endDate) {
        await this.petsService.findById(petId, userId);
        return this.healthRecordModel
            .find({
            petId,
            date: { $gte: startDate, $lte: endDate },
            isActive: true
        })
            .sort({ date: -1 })
            .exec();
    }
    async getHealthAnalytics(userId) {
        const now = new Date();
        const thisYear = new Date(now.getFullYear(), 0, 1);
        const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        const [userPets, records] = await Promise.all([
            this.petsService.findByOwner(userId),
            this.healthRecordModel.find({
                isActive: true
            }).populate({
                path: 'petId',
                match: { ownerId: userId, isActive: true }
            }).exec().then(records => records.filter(r => r.petId))
        ]);
        let totalSpent = 0, spentThisYear = 0, upcomingCount = 0;
        const recordsByMonth = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, count: 0 }));
        const typeCounts = {};
        const thisYearRecords = [];
        for (const record of records) {
            totalSpent += record.cost || 0;
            typeCounts[record.type] = (typeCounts[record.type] || 0) + 1;
            if (record.date >= thisYear) {
                thisYearRecords.push(record);
                spentThisYear += record.cost || 0;
                recordsByMonth[record.date.getMonth()].count++;
            }
            if (record.nextDueDate && record.nextDueDate > now && record.nextDueDate <= nextMonth) {
                upcomingCount++;
            }
        }
        const mostCommonType = Object.entries(typeCounts)
            .sort(([, a], [, b]) => b - a)[0]?.[0] || null;
        return {
            totalPets: userPets.length,
            totalRecords: records.length,
            recordsThisYear: thisYearRecords.length,
            upcomingReminders: upcomingCount,
            totalSpent,
            spentThisYear,
            recordsByMonth,
            mostCommonType
        };
    }
};
exports.HealthRecordsService = HealthRecordsService;
exports.HealthRecordsService = HealthRecordsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(health_record_schema_1.HealthRecord.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof pets_service_1.PetsService !== "undefined" && pets_service_1.PetsService) === "function" ? _b : Object])
], HealthRecordsService);


/***/ }),

/***/ "./src/modules/health-records/schemas/health-record.schema.ts":
/*!********************************************************************!*\
  !*** ./src/modules/health-records/schemas/health-record.schema.ts ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HealthRecordSchema = exports.HealthRecord = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
let HealthRecord = class HealthRecord extends mongoose_2.Document {
};
exports.HealthRecord = HealthRecord;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Pet', required: true }),
    __metadata("design:type", typeof (_a = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _a : Object)
], HealthRecord.prototype, "petId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], HealthRecord.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], HealthRecord.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], HealthRecord.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], HealthRecord.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], HealthRecord.prototype, "veterinarian", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], HealthRecord.prototype, "clinic", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], HealthRecord.prototype, "attachments", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], HealthRecord.prototype, "nextDueDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], HealthRecord.prototype, "weight", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], HealthRecord.prototype, "temperature", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], HealthRecord.prototype, "heartRate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], HealthRecord.prototype, "cost", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], HealthRecord.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], HealthRecord.prototype, "isReminder", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], HealthRecord.prototype, "isActive", void 0);
exports.HealthRecord = HealthRecord = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], HealthRecord);
exports.HealthRecordSchema = mongoose_1.SchemaFactory.createForClass(HealthRecord);
exports.HealthRecordSchema.index({ petId: 1, isActive: 1 });
exports.HealthRecordSchema.index({ petId: 1, type: 1, isActive: 1 });
exports.HealthRecordSchema.index({ petId: 1, date: -1 });
exports.HealthRecordSchema.index({ nextDueDate: 1, isActive: 1 });
exports.HealthRecordSchema.index({ petId: 1, nextDueDate: 1 });


/***/ }),

/***/ "./src/modules/health-reminders/health-reminders.controller.ts":
/*!*********************************************************************!*\
  !*** ./src/modules/health-reminders/health-reminders.controller.ts ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HealthRemindersController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
const health_reminders_service_1 = __webpack_require__(/*! ./health-reminders.service */ "./src/modules/health-reminders/health-reminders.service.ts");
let HealthRemindersController = class HealthRemindersController {
    constructor(healthRemindersService) {
        this.healthRemindersService = healthRemindersService;
    }
    async getReminders(req) {
        return this.healthRemindersService.getRemindersForUser(req.user._id);
    }
    async createVaccinationReminders(petId, req) {
        return this.healthRemindersService.createVaccinationReminders(petId, req.user._id);
    }
};
exports.HealthRemindersController = HealthRemindersController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all reminders for user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User health reminders' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HealthRemindersController.prototype, "getReminders", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create vaccination reminders for pet' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Vaccination reminders created' }),
    (0, common_1.Post)('pet/:petId/vaccinations'),
    __param(0, (0, common_1.Param)('petId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HealthRemindersController.prototype, "createVaccinationReminders", null);
exports.HealthRemindersController = HealthRemindersController = __decorate([
    (0, swagger_1.ApiTags)('health-reminders'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('health-reminders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof health_reminders_service_1.HealthRemindersService !== "undefined" && health_reminders_service_1.HealthRemindersService) === "function" ? _a : Object])
], HealthRemindersController);


/***/ }),

/***/ "./src/modules/health-reminders/health-reminders.module.ts":
/*!*****************************************************************!*\
  !*** ./src/modules/health-reminders/health-reminders.module.ts ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HealthRemindersModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const health_reminders_controller_1 = __webpack_require__(/*! ./health-reminders.controller */ "./src/modules/health-reminders/health-reminders.controller.ts");
const health_reminders_service_1 = __webpack_require__(/*! ./health-reminders.service */ "./src/modules/health-reminders/health-reminders.service.ts");
const health_records_module_1 = __webpack_require__(/*! ../health-records/health-records.module */ "./src/modules/health-records/health-records.module.ts");
const pets_module_1 = __webpack_require__(/*! ../pets/pets.module */ "./src/modules/pets/pets.module.ts");
let HealthRemindersModule = class HealthRemindersModule {
};
exports.HealthRemindersModule = HealthRemindersModule;
exports.HealthRemindersModule = HealthRemindersModule = __decorate([
    (0, common_1.Module)({
        imports: [health_records_module_1.HealthRecordsModule, pets_module_1.PetsModule],
        controllers: [health_reminders_controller_1.HealthRemindersController],
        providers: [health_reminders_service_1.HealthRemindersService],
        exports: [health_reminders_service_1.HealthRemindersService],
    })
], HealthRemindersModule);


/***/ }),

/***/ "./src/modules/health-reminders/health-reminders.service.ts":
/*!******************************************************************!*\
  !*** ./src/modules/health-reminders/health-reminders.service.ts ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HealthRemindersService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const schedule_1 = __webpack_require__(/*! @nestjs/schedule */ "@nestjs/schedule");
const health_records_service_1 = __webpack_require__(/*! ../health-records/health-records.service */ "./src/modules/health-records/health-records.service.ts");
const pets_service_1 = __webpack_require__(/*! ../pets/pets.service */ "./src/modules/pets/pets.service.ts");
let HealthRemindersService = class HealthRemindersService {
    constructor(healthRecordsService, petsService) {
        this.healthRecordsService = healthRecordsService;
        this.petsService = petsService;
    }
    async sendDailyReminders() {
        console.log('Checking for health reminders...');
    }
    async getRemindersForUser(userId) {
        const [upcoming, overdue] = await Promise.all([
            this.healthRecordsService.getUpcomingReminders(userId),
            this.healthRecordsService.getOverdueReminders(userId),
        ]);
        return {
            upcoming: upcoming.map(record => ({
                id: record._id,
                petName: record.petId?.name,
                type: record.type,
                title: record.title,
                dueDate: record.nextDueDate,
                daysUntilDue: Math.ceil((record.nextDueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
            })),
            overdue: overdue.map(record => ({
                id: record._id,
                petName: record.petId?.name,
                type: record.type,
                title: record.title,
                dueDate: record.nextDueDate,
                daysOverdue: Math.ceil((Date.now() - record.nextDueDate.getTime()) / (1000 * 60 * 60 * 24))
            }))
        };
    }
    async createVaccinationReminders(petId, userId) {
        const pet = await this.petsService.findById(petId, userId);
        const now = new Date();
        const vaccinationSchedule = this.getVaccinationSchedule(pet.species, pet.dateOfBirth);
        const reminders = vaccinationSchedule.map(vaccine => ({
            petId,
            type: 'vaccination',
            title: vaccine.name,
            description: vaccine.description,
            date: now,
            nextDueDate: vaccine.dueDate,
            isReminder: true
        }));
        return Promise.all(reminders.map(reminder => this.healthRecordsService.create(userId, reminder)));
    }
    getVaccinationSchedule(species, birthDate) {
        const schedules = {
            dog: [
                { name: 'DHPP (1st)', description: 'Distemper, Hepatitis, Parvovirus, Parainfluenza', weeksFromBirth: 6 },
                { name: 'DHPP (2nd)', description: 'Distemper, Hepatitis, Parvovirus, Parainfluenza', weeksFromBirth: 9 },
                { name: 'DHPP (3rd)', description: 'Distemper, Hepatitis, Parvovirus, Parainfluenza', weeksFromBirth: 12 },
                { name: 'Rabies', description: 'Rabies vaccination', weeksFromBirth: 16 },
                { name: 'DHPP Annual', description: 'Annual DHPP booster', weeksFromBirth: 52 },
            ],
            cat: [
                { name: 'FVRCP (1st)', description: 'Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia', weeksFromBirth: 6 },
                { name: 'FVRCP (2nd)', description: 'Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia', weeksFromBirth: 9 },
                { name: 'FVRCP (3rd)', description: 'Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia', weeksFromBirth: 12 },
                { name: 'Rabies', description: 'Rabies vaccination', weeksFromBirth: 16 },
                { name: 'FVRCP Annual', description: 'Annual FVRCP booster', weeksFromBirth: 52 },
            ]
        };
        const schedule = schedules[species.toLowerCase()] || schedules.dog;
        return schedule.map(vaccine => ({
            ...vaccine,
            dueDate: new Date(birthDate.getTime() + vaccine.weeksFromBirth * 7 * 24 * 60 * 60 * 1000)
        }));
    }
};
exports.HealthRemindersService = HealthRemindersService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_9AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthRemindersService.prototype, "sendDailyReminders", null);
exports.HealthRemindersService = HealthRemindersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof health_records_service_1.HealthRecordsService !== "undefined" && health_records_service_1.HealthRecordsService) === "function" ? _a : Object, typeof (_b = typeof pets_service_1.PetsService !== "undefined" && pets_service_1.PetsService) === "function" ? _b : Object])
], HealthRemindersService);


/***/ }),

/***/ "./src/modules/insurance/dto/create-insurance.dto.ts":
/*!***********************************************************!*\
  !*** ./src/modules/insurance/dto/create-insurance.dto.ts ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateInsuranceDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class CreateInsuranceDto {
}
exports.CreateInsuranceDto = CreateInsuranceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Pet ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInsuranceDto.prototype, "petId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Insurance provider name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInsuranceDto.prototype, "provider", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Policy number' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInsuranceDto.prototype, "policyNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Plan type' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInsuranceDto.prototype, "planType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Monthly premium amount' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateInsuranceDto.prototype, "monthlyPremium", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Deductible amount' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateInsuranceDto.prototype, "deductible", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Coverage limit' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateInsuranceDto.prototype, "coverageLimit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Policy start date' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateInsuranceDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Policy end date' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateInsuranceDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional notes', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInsuranceDto.prototype, "notes", void 0);


/***/ }),

/***/ "./src/modules/insurance/dto/insurance-claim.dto.ts":
/*!**********************************************************!*\
  !*** ./src/modules/insurance/dto/insurance-claim.dto.ts ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InsuranceClaimDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class InsuranceClaimDto {
}
exports.InsuranceClaimDto = InsuranceClaimDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Insurance policy ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InsuranceClaimDto.prototype, "insuranceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Claim amount' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], InsuranceClaimDto.prototype, "claimAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Claim description' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InsuranceClaimDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date of service' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], InsuranceClaimDto.prototype, "serviceDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Veterinarian or clinic name', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InsuranceClaimDto.prototype, "provider", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Treatment type', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InsuranceClaimDto.prototype, "treatmentType", void 0);


/***/ }),

/***/ "./src/modules/insurance/dto/update-insurance.dto.ts":
/*!***********************************************************!*\
  !*** ./src/modules/insurance/dto/update-insurance.dto.ts ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateInsuranceDto = void 0;
const mapped_types_1 = __webpack_require__(/*! @nestjs/mapped-types */ "@nestjs/mapped-types");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const create_insurance_dto_1 = __webpack_require__(/*! ./create-insurance.dto */ "./src/modules/insurance/dto/create-insurance.dto.ts");
class UpdateInsuranceDto extends (0, mapped_types_1.PartialType)(create_insurance_dto_1.CreateInsuranceDto) {
}
exports.UpdateInsuranceDto = UpdateInsuranceDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Policy status',
        enum: ['active', 'expired', 'cancelled', 'pending'],
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['active', 'expired', 'cancelled', 'pending']),
    __metadata("design:type", String)
], UpdateInsuranceDto.prototype, "status", void 0);


/***/ }),

/***/ "./src/modules/insurance/insurance.controller.ts":
/*!*******************************************************!*\
  !*** ./src/modules/insurance/insurance.controller.ts ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InsuranceController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
const insurance_service_1 = __webpack_require__(/*! ./insurance.service */ "./src/modules/insurance/insurance.service.ts");
const create_insurance_dto_1 = __webpack_require__(/*! ./dto/create-insurance.dto */ "./src/modules/insurance/dto/create-insurance.dto.ts");
const update_insurance_dto_1 = __webpack_require__(/*! ./dto/update-insurance.dto */ "./src/modules/insurance/dto/update-insurance.dto.ts");
const insurance_claim_dto_1 = __webpack_require__(/*! ./dto/insurance-claim.dto */ "./src/modules/insurance/dto/insurance-claim.dto.ts");
let InsuranceController = class InsuranceController {
    constructor(insuranceService) {
        this.insuranceService = insuranceService;
    }
    async create(req, createInsuranceDto) {
        return this.insuranceService.create(req.user._id, createInsuranceDto);
    }
    async findAll(req, status, petId) {
        return this.insuranceService.findByUser(req.user._id, status, petId);
    }
    async findOne(id, req) {
        return this.insuranceService.findById(id, req.user._id);
    }
    async update(id, updateInsuranceDto, req) {
        return this.insuranceService.update(id, req.user._id, updateInsuranceDto);
    }
    async updateStatus(id, status, req) {
        return this.insuranceService.updateStatus(id, req.user._id, status);
    }
    async remove(id, req) {
        return this.insuranceService.delete(id, req.user._id);
    }
    async findActivePoliciesByPet(petId, req) {
        return this.insuranceService.findActivePoliciesByPet(petId, req.user._id);
    }
    async checkCoverage(id, amount, req) {
        return this.insuranceService.checkCoverage(id, req.user._id, amount);
    }
    async submitClaim(req, claimDto) {
        return this.insuranceService.submitClaim(req.user._id, claimDto);
    }
    async getClaims(req, status) {
        return this.insuranceService.getUserClaims(req.user._id, status);
    }
    async getClaim(claimId, req) {
        return this.insuranceService.getClaimById(claimId, req.user._id);
    }
};
exports.InsuranceController = InsuranceController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create new insurance policy' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Insurance policy created successfully' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_insurance_dto_1.CreateInsuranceDto !== "undefined" && create_insurance_dto_1.CreateInsuranceDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all user insurance policies' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of user insurance policies' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, description: 'Filter by status' }),
    (0, swagger_1.ApiQuery)({ name: 'petId', required: false, description: 'Filter by pet ID' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('petId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get insurance policy by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Insurance policy details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Insurance policy not found' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update insurance policy' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Insurance policy updated successfully' }),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof update_insurance_dto_1.UpdateInsuranceDto !== "undefined" && update_insurance_dto_1.UpdateInsuranceDto) === "function" ? _c : Object, Object]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update insurance policy status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Insurance status updated' }),
    (0, common_1.Put)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "updateStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete insurance policy' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Insurance policy deleted successfully' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "remove", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get active policies by pet' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Active insurance policies for pet' }),
    (0, common_1.Get)('pet/:petId/active'),
    __param(0, (0, common_1.Param)('petId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "findActivePoliciesByPet", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Check policy coverage for amount' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Coverage check result' }),
    (0, common_1.Get)(':id/coverage/:amount'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('amount')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "checkCoverage", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Submit insurance claim' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Claim submitted successfully' }),
    (0, common_1.Post)('claims'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_d = typeof insurance_claim_dto_1.InsuranceClaimDto !== "undefined" && insurance_claim_dto_1.InsuranceClaimDto) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "submitClaim", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get user claims' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of user claims' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, description: 'Filter by status' }),
    (0, common_1.Get)('claims'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "getClaims", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get claim by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Claim details' }),
    (0, common_1.Get)('claims/:claimId'),
    __param(0, (0, common_1.Param)('claimId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InsuranceController.prototype, "getClaim", null);
exports.InsuranceController = InsuranceController = __decorate([
    (0, swagger_1.ApiTags)('insurance'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('insurance'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof insurance_service_1.InsuranceService !== "undefined" && insurance_service_1.InsuranceService) === "function" ? _a : Object])
], InsuranceController);


/***/ }),

/***/ "./src/modules/insurance/insurance.module.ts":
/*!***************************************************!*\
  !*** ./src/modules/insurance/insurance.module.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InsuranceModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const insurance_controller_1 = __webpack_require__(/*! ./insurance.controller */ "./src/modules/insurance/insurance.controller.ts");
const insurance_service_1 = __webpack_require__(/*! ./insurance.service */ "./src/modules/insurance/insurance.service.ts");
const insurance_schema_1 = __webpack_require__(/*! ./schemas/insurance.schema */ "./src/modules/insurance/schemas/insurance.schema.ts");
const insurance_claim_schema_1 = __webpack_require__(/*! ./schemas/insurance-claim.schema */ "./src/modules/insurance/schemas/insurance-claim.schema.ts");
let InsuranceModule = class InsuranceModule {
};
exports.InsuranceModule = InsuranceModule;
exports.InsuranceModule = InsuranceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: insurance_schema_1.Insurance.name, schema: insurance_schema_1.InsuranceSchema },
                { name: insurance_claim_schema_1.InsuranceClaim.name, schema: insurance_claim_schema_1.InsuranceClaimSchema }
            ]),
        ],
        controllers: [insurance_controller_1.InsuranceController],
        providers: [insurance_service_1.InsuranceService],
        exports: [insurance_service_1.InsuranceService],
    })
], InsuranceModule);


/***/ }),

/***/ "./src/modules/insurance/insurance.service.ts":
/*!****************************************************!*\
  !*** ./src/modules/insurance/insurance.service.ts ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InsuranceService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const insurance_schema_1 = __webpack_require__(/*! ./schemas/insurance.schema */ "./src/modules/insurance/schemas/insurance.schema.ts");
const insurance_claim_schema_1 = __webpack_require__(/*! ./schemas/insurance-claim.schema */ "./src/modules/insurance/schemas/insurance-claim.schema.ts");
let InsuranceService = class InsuranceService {
    constructor(insuranceModel, claimModel) {
        this.insuranceModel = insuranceModel;
        this.claimModel = claimModel;
    }
    async create(userId, createInsuranceDto) {
        const insuranceData = {
            ...createInsuranceDto,
            userId,
            startDate: new Date(createInsuranceDto.startDate),
            endDate: new Date(createInsuranceDto.endDate),
        };
        if (insuranceData.startDate >= insuranceData.endDate) {
            throw new common_1.BadRequestException('Start date must be before end date');
        }
        const insurance = new this.insuranceModel(insuranceData);
        return insurance.save();
    }
    async findByUser(userId, status, petId) {
        const filter = { userId, isActive: true };
        if (status)
            filter.status = status;
        if (petId)
            filter.petId = petId;
        return this.insuranceModel
            .find(filter)
            .populate('petId', 'name species breed')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findById(id, userId) {
        const insurance = await this.insuranceModel
            .findById(id)
            .populate('petId', 'name species breed')
            .exec();
        if (!insurance) {
            throw new common_1.NotFoundException('Insurance policy not found');
        }
        if (userId && insurance.userId.toString() !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return insurance;
    }
    async update(id, userId, updateInsuranceDto) {
        await this.findById(id, userId);
        const updateData = { ...updateInsuranceDto };
        if (updateInsuranceDto.startDate) {
            updateData.startDate = new Date(updateInsuranceDto.startDate);
        }
        if (updateInsuranceDto.endDate) {
            updateData.endDate = new Date(updateInsuranceDto.endDate);
        }
        return this.insuranceModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .populate('petId', 'name species breed')
            .exec();
    }
    async updateStatus(id, userId, status) {
        await this.findById(id, userId);
        const validStatuses = ['active', 'expired', 'cancelled', 'pending'];
        if (!validStatuses.includes(status)) {
            throw new common_1.BadRequestException('Invalid status');
        }
        return this.insuranceModel
            .findByIdAndUpdate(id, { status }, { new: true })
            .populate('petId', 'name species breed')
            .exec();
    }
    async delete(id, userId) {
        await this.findById(id, userId);
        return this.insuranceModel
            .findByIdAndUpdate(id, { isActive: false }, { new: true })
            .exec();
    }
    async findActivePoliciesByPet(petId, userId) {
        return this.insuranceModel
            .find({
            petId,
            userId,
            status: 'active',
            isActive: true,
            startDate: { $lte: new Date() },
            endDate: { $gte: new Date() }
        })
            .populate('petId', 'name species breed')
            .exec();
    }
    async checkCoverage(id, userId, amount) {
        const insurance = await this.findById(id, userId);
        if (insurance.status !== 'active') {
            return {
                covered: false,
                reason: 'Policy is not active',
                coverageAmount: 0
            };
        }
        const currentDate = new Date();
        if (currentDate < insurance.startDate || currentDate > insurance.endDate) {
            return {
                covered: false,
                reason: 'Policy is not in effect',
                coverageAmount: 0
            };
        }
        const maxCoverage = Math.max(0, insurance.coverageLimit - insurance.deductible);
        const coverageAmount = Math.min(amount - insurance.deductible, maxCoverage);
        return {
            covered: coverageAmount > 0,
            coverageAmount: Math.max(0, coverageAmount),
            deductible: insurance.deductible,
            remainingLimit: insurance.coverageLimit,
            outOfPocket: Math.max(0, amount - coverageAmount)
        };
    }
    async findExpiringPolicies(userId, days = 30) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + days);
        return this.insuranceModel
            .find({
            userId,
            status: 'active',
            isActive: true,
            endDate: { $lte: futureDate, $gte: new Date() }
        })
            .populate('petId', 'name species breed')
            .exec();
    }
    async submitClaim(userId, claimDto) {
        const insurance = await this.findById(claimDto.insuranceId, userId);
        if (insurance.status !== 'active') {
            throw new common_1.BadRequestException('Cannot submit claim for inactive policy');
        }
        const claimData = {
            ...claimDto,
            userId,
            serviceDate: new Date(claimDto.serviceDate)
        };
        const claim = new this.claimModel(claimData);
        return claim.save();
    }
    async getUserClaims(userId, status) {
        const filter = { userId, isActive: true };
        if (status)
            filter.status = status;
        return this.claimModel
            .find(filter)
            .populate('insuranceId', 'provider policyNumber')
            .sort({ createdAt: -1 })
            .exec();
    }
    async getClaimById(claimId, userId) {
        const claim = await this.claimModel
            .findById(claimId)
            .populate('insuranceId', 'provider policyNumber petId')
            .exec();
        if (!claim) {
            throw new common_1.NotFoundException('Claim not found');
        }
        if (claim.userId.toString() !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return claim;
    }
};
exports.InsuranceService = InsuranceService;
exports.InsuranceService = InsuranceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(insurance_schema_1.Insurance.name)),
    __param(1, (0, mongoose_1.InjectModel)(insurance_claim_schema_1.InsuranceClaim.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object])
], InsuranceService);


/***/ }),

/***/ "./src/modules/insurance/schemas/insurance-claim.schema.ts":
/*!*****************************************************************!*\
  !*** ./src/modules/insurance/schemas/insurance-claim.schema.ts ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InsuranceClaimSchema = exports.InsuranceClaim = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
let InsuranceClaim = class InsuranceClaim {
};
exports.InsuranceClaim = InsuranceClaim;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Insurance', required: true }),
    __metadata("design:type", typeof (_a = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _a : Object)
], InsuranceClaim.prototype, "insuranceId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", typeof (_b = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _b : Object)
], InsuranceClaim.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], InsuranceClaim.prototype, "claimAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], InsuranceClaim.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], InsuranceClaim.prototype, "serviceDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], InsuranceClaim.prototype, "provider", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], InsuranceClaim.prototype, "treatmentType", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['pending', 'approved', 'denied', 'processing'],
        default: 'pending'
    }),
    __metadata("design:type", String)
], InsuranceClaim.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], InsuranceClaim.prototype, "approvedAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], InsuranceClaim.prototype, "denialReason", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], InsuranceClaim.prototype, "processedDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], InsuranceClaim.prototype, "isActive", void 0);
exports.InsuranceClaim = InsuranceClaim = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], InsuranceClaim);
exports.InsuranceClaimSchema = mongoose_1.SchemaFactory.createForClass(InsuranceClaim);


/***/ }),

/***/ "./src/modules/insurance/schemas/insurance.schema.ts":
/*!***********************************************************!*\
  !*** ./src/modules/insurance/schemas/insurance.schema.ts ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InsuranceSchema = exports.Insurance = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
let Insurance = class Insurance {
};
exports.Insurance = Insurance;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", typeof (_a = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _a : Object)
], Insurance.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Pet', required: true }),
    __metadata("design:type", typeof (_b = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _b : Object)
], Insurance.prototype, "petId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Insurance.prototype, "provider", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Insurance.prototype, "policyNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Insurance.prototype, "planType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Insurance.prototype, "monthlyPremium", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Insurance.prototype, "deductible", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Insurance.prototype, "coverageLimit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Insurance.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], Insurance.prototype, "endDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['active', 'expired', 'cancelled', 'pending'],
        default: 'active'
    }),
    __metadata("design:type", String)
], Insurance.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Insurance.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Insurance.prototype, "isActive", void 0);
exports.Insurance = Insurance = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Insurance);
exports.InsuranceSchema = mongoose_1.SchemaFactory.createForClass(Insurance);


/***/ }),

/***/ "./src/modules/medications/dto/create-medication.dto.ts":
/*!**************************************************************!*\
  !*** ./src/modules/medications/dto/create-medication.dto.ts ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateMedicationDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class CreateMedicationDto {
}
exports.CreateMedicationDto = CreateMedicationDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMedicationDto.prototype, "petId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMedicationDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMedicationDto.prototype, "dosage", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['daily', 'weekly', 'monthly', 'as-needed']),
    __metadata("design:type", String)
], CreateMedicationDto.prototype, "frequency", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateMedicationDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateMedicationDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMedicationDto.prototype, "instructions", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMedicationDto.prototype, "veterinarian", void 0);


/***/ }),

/***/ "./src/modules/medications/dto/update-medication.dto.ts":
/*!**************************************************************!*\
  !*** ./src/modules/medications/dto/update-medication.dto.ts ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateMedicationDto = void 0;
const mapped_types_1 = __webpack_require__(/*! @nestjs/mapped-types */ "@nestjs/mapped-types");
const create_medication_dto_1 = __webpack_require__(/*! ./create-medication.dto */ "./src/modules/medications/dto/create-medication.dto.ts");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class UpdateMedicationDto extends (0, mapped_types_1.PartialType)(create_medication_dto_1.CreateMedicationDto) {
}
exports.UpdateMedicationDto = UpdateMedicationDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateMedicationDto.prototype, "isCompleted", void 0);


/***/ }),

/***/ "./src/modules/medications/medications.controller.ts":
/*!***********************************************************!*\
  !*** ./src/modules/medications/medications.controller.ts ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MedicationsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const medications_service_1 = __webpack_require__(/*! ./medications.service */ "./src/modules/medications/medications.service.ts");
const create_medication_dto_1 = __webpack_require__(/*! ./dto/create-medication.dto */ "./src/modules/medications/dto/create-medication.dto.ts");
const update_medication_dto_1 = __webpack_require__(/*! ./dto/update-medication.dto */ "./src/modules/medications/dto/update-medication.dto.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
let MedicationsController = class MedicationsController {
    constructor(medicationsService) {
        this.medicationsService = medicationsService;
    }
    create(req, createMedicationDto) {
        return this.medicationsService.create(req.user.userId, createMedicationDto);
    }
    findActive(req) {
        return this.medicationsService.findActive(req.user.userId);
    }
    findByPet(petId, req) {
        return this.medicationsService.findByPet(petId, req.user.userId);
    }
    findOne(id, req) {
        return this.medicationsService.findById(id, req.user.userId);
    }
    update(id, req, updateMedicationDto) {
        return this.medicationsService.update(id, req.user.userId, updateMedicationDto);
    }
    markCompleted(id, req) {
        return this.medicationsService.markCompleted(id, req.user.userId);
    }
    remove(id, req) {
        return this.medicationsService.delete(id, req.user.userId);
    }
};
exports.MedicationsController = MedicationsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_medication_dto_1.CreateMedicationDto !== "undefined" && create_medication_dto_1.CreateMedicationDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], MedicationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('active'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MedicationsController.prototype, "findActive", null);
__decorate([
    (0, common_1.Get)('pet/:petId'),
    __param(0, (0, common_1.Param)('petId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MedicationsController.prototype, "findByPet", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MedicationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_c = typeof update_medication_dto_1.UpdateMedicationDto !== "undefined" && update_medication_dto_1.UpdateMedicationDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], MedicationsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/complete'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MedicationsController.prototype, "markCompleted", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MedicationsController.prototype, "remove", null);
exports.MedicationsController = MedicationsController = __decorate([
    (0, common_1.Controller)('medications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof medications_service_1.MedicationsService !== "undefined" && medications_service_1.MedicationsService) === "function" ? _a : Object])
], MedicationsController);


/***/ }),

/***/ "./src/modules/medications/medications.module.ts":
/*!*******************************************************!*\
  !*** ./src/modules/medications/medications.module.ts ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MedicationsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const medications_service_1 = __webpack_require__(/*! ./medications.service */ "./src/modules/medications/medications.service.ts");
const medications_controller_1 = __webpack_require__(/*! ./medications.controller */ "./src/modules/medications/medications.controller.ts");
const medication_schema_1 = __webpack_require__(/*! ./schemas/medication.schema */ "./src/modules/medications/schemas/medication.schema.ts");
const pets_module_1 = __webpack_require__(/*! ../pets/pets.module */ "./src/modules/pets/pets.module.ts");
let MedicationsModule = class MedicationsModule {
};
exports.MedicationsModule = MedicationsModule;
exports.MedicationsModule = MedicationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: medication_schema_1.Medication.name, schema: medication_schema_1.MedicationSchema }]),
            pets_module_1.PetsModule,
        ],
        controllers: [medications_controller_1.MedicationsController],
        providers: [medications_service_1.MedicationsService],
        exports: [medications_service_1.MedicationsService],
    })
], MedicationsModule);


/***/ }),

/***/ "./src/modules/medications/medications.service.ts":
/*!********************************************************!*\
  !*** ./src/modules/medications/medications.service.ts ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MedicationsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const medication_schema_1 = __webpack_require__(/*! ./schemas/medication.schema */ "./src/modules/medications/schemas/medication.schema.ts");
const pets_service_1 = __webpack_require__(/*! ../pets/pets.service */ "./src/modules/pets/pets.service.ts");
const validation_util_1 = __webpack_require__(/*! ../../common/utils/validation.util */ "./src/common/utils/validation.util.ts");
const database_error_handler_1 = __webpack_require__(/*! ../../common/utils/database-error.handler */ "./src/common/utils/database-error.handler.ts");
let MedicationsService = class MedicationsService {
    constructor(medicationModel, petsService) {
        this.medicationModel = medicationModel;
        this.petsService = petsService;
    }
    async create(userId, createMedicationDto) {
        try {
            validation_util_1.ValidationUtil.validateObjectId(createMedicationDto.petId, 'Pet ID');
            await this.petsService.findById(createMedicationDto.petId, userId);
            const medicationData = {
                ...createMedicationDto,
                petId: new mongoose_2.Types.ObjectId(createMedicationDto.petId),
                startDate: validation_util_1.ValidationUtil.validateDate(createMedicationDto.startDate, 'start date'),
                endDate: validation_util_1.ValidationUtil.validateOptionalDate(createMedicationDto.endDate, 'end date'),
            };
            const medication = new this.medicationModel(medicationData);
            return await medication.save();
        }
        catch (error) {
            database_error_handler_1.DatabaseErrorHandler.handle(error, 'Create medication');
        }
    }
    async findByPet(petId, userId) {
        try {
            validation_util_1.ValidationUtil.validateObjectId(petId, 'Pet ID');
            await this.petsService.findById(petId, userId);
            return this.medicationModel.find({ petId, isActive: true }).sort({ startDate: -1 });
        }
        catch (error) {
            database_error_handler_1.DatabaseErrorHandler.handle(error, 'Find medications by pet');
        }
    }
    async findActive(userId) {
        try {
            const userPets = await this.petsService.findByOwner(userId);
            const petIds = userPets.map(pet => pet._id);
            return this.medicationModel.find({
                petId: { $in: petIds },
                isActive: true,
                isCompleted: false,
                $or: [
                    { endDate: { $exists: false } },
                    { endDate: { $gte: new Date() } }
                ]
            }).populate('petId', 'name species').sort({ startDate: -1 });
        }
        catch (error) {
            database_error_handler_1.DatabaseErrorHandler.handle(error, 'Find active medications');
        }
    }
    async findById(id, userId) {
        try {
            validation_util_1.ValidationUtil.validateObjectId(id, 'Medication ID');
            const medication = await this.medicationModel.findById(id).populate('petId');
            if (!medication) {
                throw new common_1.NotFoundException('Medication not found');
            }
            await this.petsService.findById(medication.petId.toString(), userId);
            return medication;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            database_error_handler_1.DatabaseErrorHandler.handle(error, 'Find medication by ID');
        }
    }
    async update(id, userId, updateMedicationDto) {
        try {
            await this.findById(id, userId);
            const updateData = { ...updateMedicationDto };
            if (updateMedicationDto.startDate) {
                updateData.startDate = validation_util_1.ValidationUtil.validateDate(updateMedicationDto.startDate, 'start date');
            }
            if (updateMedicationDto.endDate) {
                updateData.endDate = validation_util_1.ValidationUtil.validateDate(updateMedicationDto.endDate, 'end date');
            }
            return this.medicationModel.findByIdAndUpdate(id, updateData, { new: true });
        }
        catch (error) {
            database_error_handler_1.DatabaseErrorHandler.handle(error, 'Update medication');
        }
    }
    async delete(id, userId) {
        try {
            await this.findById(id, userId);
            return this.medicationModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
        }
        catch (error) {
            database_error_handler_1.DatabaseErrorHandler.handle(error, 'Delete medication');
        }
    }
    async markCompleted(id, userId) {
        try {
            await this.findById(id, userId);
            return this.medicationModel.findByIdAndUpdate(id, { isCompleted: true }, { new: true });
        }
        catch (error) {
            database_error_handler_1.DatabaseErrorHandler.handle(error, 'Mark medication completed');
        }
    }
};
exports.MedicationsService = MedicationsService;
exports.MedicationsService = MedicationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(medication_schema_1.Medication.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof pets_service_1.PetsService !== "undefined" && pets_service_1.PetsService) === "function" ? _b : Object])
], MedicationsService);


/***/ }),

/***/ "./src/modules/medications/schemas/medication.schema.ts":
/*!**************************************************************!*\
  !*** ./src/modules/medications/schemas/medication.schema.ts ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MedicationSchema = exports.Medication = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
let Medication = class Medication {
};
exports.Medication = Medication;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Pet', required: true }),
    __metadata("design:type", typeof (_a = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _a : Object)
], Medication.prototype, "petId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Medication.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Medication.prototype, "dosage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['daily', 'weekly', 'monthly', 'as-needed'] }),
    __metadata("design:type", String)
], Medication.prototype, "frequency", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Medication.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Medication.prototype, "endDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Medication.prototype, "instructions", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Medication.prototype, "veterinarian", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Medication.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Medication.prototype, "isCompleted", void 0);
exports.Medication = Medication = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Medication);
exports.MedicationSchema = mongoose_1.SchemaFactory.createForClass(Medication);


/***/ }),

/***/ "./src/modules/notifications/notifications.module.ts":
/*!***********************************************************!*\
  !*** ./src/modules/notifications/notifications.module.ts ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let NotificationsModule = class NotificationsModule {
};
exports.NotificationsModule = NotificationsModule;
exports.NotificationsModule = NotificationsModule = __decorate([
    (0, common_1.Module)({})
], NotificationsModule);


/***/ }),

/***/ "./src/modules/pets/dto/create-pet.dto.ts":
/*!************************************************!*\
  !*** ./src/modules/pets/dto/create-pet.dto.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreatePetDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class CreatePetDto {
}
exports.CreatePetDto = CreatePetDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Pet name', example: 'Buddy' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePetDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Pet species',
        enum: ['dog', 'cat', 'bird', 'rabbit', 'hamster', 'fish', 'reptile', 'other']
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(['dog', 'cat', 'bird', 'rabbit', 'hamster', 'fish', 'reptile', 'other']),
    __metadata("design:type", String)
], CreatePetDto.prototype, "species", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Pet breed', example: 'Golden Retriever' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePetDto.prototype, "breed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Pet age in years', minimum: 0, maximum: 30 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(30),
    __metadata("design:type", Number)
], CreatePetDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Pet gender', enum: ['male', 'female'] }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(['male', 'female']),
    __metadata("design:type", String)
], CreatePetDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Pet weight in kg' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePetDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Pet color' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePetDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Microchip ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePetDto.prototype, "microchipId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Profile image URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePetDto.prototype, "profileImage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Date of birth', example: '2020-01-15' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePetDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Medical notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePetDto.prototype, "medicalNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Emergency contact name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePetDto.prototype, "emergencyContactName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Emergency contact phone' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePetDto.prototype, "emergencyContactPhone", void 0);


/***/ }),

/***/ "./src/modules/pets/dto/update-pet.dto.ts":
/*!************************************************!*\
  !*** ./src/modules/pets/dto/update-pet.dto.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdatePetDto = void 0;
const mapped_types_1 = __webpack_require__(/*! @nestjs/mapped-types */ "@nestjs/mapped-types");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const create_pet_dto_1 = __webpack_require__(/*! ./create-pet.dto */ "./src/modules/pets/dto/create-pet.dto.ts");
class UpdatePetDto extends (0, mapped_types_1.PartialType)(create_pet_dto_1.CreatePetDto) {
}
exports.UpdatePetDto = UpdatePetDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Pet health status',
        enum: ['healthy', 'sick', 'recovering', 'chronic']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['healthy', 'sick', 'recovering', 'chronic']),
    __metadata("design:type", String)
], UpdatePetDto.prototype, "healthStatus", void 0);


/***/ }),

/***/ "./src/modules/pets/pets.controller.ts":
/*!*********************************************!*\
  !*** ./src/modules/pets/pets.controller.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PetsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
const pets_service_1 = __webpack_require__(/*! ./pets.service */ "./src/modules/pets/pets.service.ts");
const create_pet_dto_1 = __webpack_require__(/*! ./dto/create-pet.dto */ "./src/modules/pets/dto/create-pet.dto.ts");
const update_pet_dto_1 = __webpack_require__(/*! ./dto/update-pet.dto */ "./src/modules/pets/dto/update-pet.dto.ts");
let PetsController = class PetsController {
    constructor(petsService) {
        this.petsService = petsService;
    }
    async create(req, createPetDto) {
        const petData = {
            ...createPetDto,
            ownerId: req.user._id,
            dateOfBirth: createPetDto.dateOfBirth ? new Date(createPetDto.dateOfBirth) : undefined
        };
        return this.petsService.create(petData);
    }
    async findMyPets(req, species) {
        return this.petsService.findByOwner(req.user._id, species);
    }
    async findOne(id, req) {
        return this.petsService.findById(id, req.user._id);
    }
    async update(id, updatePetDto, req) {
        const petData = { ...updatePetDto };
        if (updatePetDto.dateOfBirth) {
            petData.dateOfBirth = new Date(updatePetDto.dateOfBirth);
        }
        return this.petsService.update(id, req.user._id, petData);
    }
    async updateHealthStatus(id, status, req) {
        return this.petsService.updateHealthStatus(id, req.user._id, status);
    }
    async remove(id, req) {
        return this.petsService.delete(id, req.user._id);
    }
};
exports.PetsController = PetsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Add a new pet' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Pet created successfully' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_pet_dto_1.CreatePetDto !== "undefined" && create_pet_dto_1.CreatePetDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], PetsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all user pets' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of user pets' }),
    (0, swagger_1.ApiQuery)({ name: 'species', required: false, description: 'Filter by species' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('species')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PetsController.prototype, "findMyPets", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get pet by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pet details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Pet not found' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PetsController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update pet information' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pet updated successfully' }),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof update_pet_dto_1.UpdatePetDto !== "undefined" && update_pet_dto_1.UpdatePetDto) === "function" ? _c : Object, Object]),
    __metadata("design:returntype", Promise)
], PetsController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update pet health status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Health status updated' }),
    (0, common_1.Put)(':id/health-status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PetsController.prototype, "updateHealthStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete pet' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pet deleted successfully' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PetsController.prototype, "remove", null);
exports.PetsController = PetsController = __decorate([
    (0, swagger_1.ApiTags)('pets'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('pets'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof pets_service_1.PetsService !== "undefined" && pets_service_1.PetsService) === "function" ? _a : Object])
], PetsController);


/***/ }),

/***/ "./src/modules/pets/pets.module.ts":
/*!*****************************************!*\
  !*** ./src/modules/pets/pets.module.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PetsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const pets_controller_1 = __webpack_require__(/*! ./pets.controller */ "./src/modules/pets/pets.controller.ts");
const pets_service_1 = __webpack_require__(/*! ./pets.service */ "./src/modules/pets/pets.service.ts");
const pet_schema_1 = __webpack_require__(/*! ./schemas/pet.schema */ "./src/modules/pets/schemas/pet.schema.ts");
let PetsModule = class PetsModule {
};
exports.PetsModule = PetsModule;
exports.PetsModule = PetsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: pet_schema_1.Pet.name, schema: pet_schema_1.PetSchema }]),
        ],
        controllers: [pets_controller_1.PetsController],
        providers: [pets_service_1.PetsService],
        exports: [pets_service_1.PetsService],
    })
], PetsModule);


/***/ }),

/***/ "./src/modules/pets/pets.service.ts":
/*!******************************************!*\
  !*** ./src/modules/pets/pets.service.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PetsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const pet_schema_1 = __webpack_require__(/*! ./schemas/pet.schema */ "./src/modules/pets/schemas/pet.schema.ts");
let PetsService = class PetsService {
    constructor(petModel) {
        this.petModel = petModel;
    }
    async create(petData) {
        const pet = new this.petModel(petData);
        return pet.save();
    }
    async findByOwner(ownerId, species) {
        const filter = { ownerId, isActive: true };
        if (species)
            filter.species = species;
        return this.petModel.find(filter).sort({ name: 1 }).exec();
    }
    async findById(id, ownerId) {
        const pet = await this.petModel.findById(id).exec();
        if (!pet)
            throw new common_1.NotFoundException('Pet not found');
        if (ownerId && pet.ownerId.toString() !== ownerId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return pet;
    }
    async update(id, ownerId, updateData) {
        await this.findById(id, ownerId);
        return this.petModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }
    async delete(id, ownerId) {
        await this.findById(id, ownerId);
        return this.petModel.findByIdAndUpdate(id, { isActive: false }, { new: true }).exec();
    }
    async updateHealthStatus(id, ownerId, status) {
        await this.findById(id, ownerId);
        const validStatuses = ['healthy', 'sick', 'recovering', 'chronic'];
        if (!validStatuses.includes(status)) {
            throw new Error('Invalid health status');
        }
        return this.petModel.findByIdAndUpdate(id, { healthStatus: status }, { new: true }).exec();
    }
    async findByHealthStatus(ownerId, status) {
        return this.petModel.find({ ownerId, healthStatus: status, isActive: true }).exec();
    }
};
exports.PetsService = PetsService;
exports.PetsService = PetsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(pet_schema_1.Pet.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], PetsService);


/***/ }),

/***/ "./src/modules/pets/schemas/pet.schema.ts":
/*!************************************************!*\
  !*** ./src/modules/pets/schemas/pet.schema.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PetSchema = exports.Pet = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
let Pet = class Pet extends mongoose_2.Document {
};
exports.Pet = Pet;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Pet.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Pet.prototype, "species", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Pet.prototype, "breed", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Pet.prototype, "age", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Pet.prototype, "gender", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Pet.prototype, "weight", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Pet.prototype, "color", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Pet.prototype, "microchipId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Pet.prototype, "profileImage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", typeof (_a = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _a : Object)
], Pet.prototype, "ownerId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Pet.prototype, "dateOfBirth", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Pet.prototype, "medicalNotes", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Pet.prototype, "emergencyContactName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Pet.prototype, "emergencyContactPhone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'healthy', enum: ['healthy', 'sick', 'recovering', 'chronic'] }),
    __metadata("design:type", String)
], Pet.prototype, "healthStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Pet.prototype, "isActive", void 0);
exports.Pet = Pet = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Pet);
exports.PetSchema = mongoose_1.SchemaFactory.createForClass(Pet);
exports.PetSchema.index({ ownerId: 1, isActive: 1 });
exports.PetSchema.index({ ownerId: 1, species: 1, isActive: 1 });
exports.PetSchema.index({ ownerId: 1, healthStatus: 1, isActive: 1 });


/***/ }),

/***/ "./src/modules/seed/healthRecords.ts":
/*!*******************************************!*\
  !*** ./src/modules/seed/healthRecords.ts ***!
  \*******************************************/
/***/ ((module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sampleHealthRecords = void 0;
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const pets_1 = __webpack_require__(/*! ./pets */ "./src/modules/seed/pets.ts");
exports.sampleHealthRecords = [
    {
        _id: new mongoose_1.Types.ObjectId(),
        petId: pets_1.samplePets[0]._id,
        type: 'vaccination',
        title: 'Annual Vaccination - DHPP',
        description: 'Distemper, Hepatitis, Parvovirus, Parainfluenza vaccination',
        date: new Date('2024-01-15'),
        veterinarian: 'Dr. Emily Johnson',
        clinic: 'City Veterinary Clinic',
        nextDueDate: new Date('2025-01-15'),
        weight: 30.5,
        temperature: 101.2,
        cost: 85.00,
        notes: 'Pet responded well to vaccination. No adverse reactions.',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: new mongoose_1.Types.ObjectId(),
        petId: pets_1.samplePets[0]._id,
        type: 'checkup',
        title: 'Annual Health Checkup',
        description: 'Comprehensive physical examination and blood work',
        date: new Date('2024-01-15'),
        veterinarian: 'Dr. Emily Johnson',
        clinic: 'City Veterinary Clinic',
        weight: 30.5,
        temperature: 101.2,
        heartRate: 120,
        cost: 150.00,
        notes: 'Overall health excellent. Recommend dental cleaning next visit.',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: new mongoose_1.Types.ObjectId(),
        petId: pets_1.samplePets[0]._id,
        type: 'treatment',
        title: 'Ear Infection Treatment',
        description: 'Treatment for bacterial ear infection',
        date: new Date('2023-11-20'),
        veterinarian: 'Dr. Michael Brown',
        clinic: 'City Veterinary Clinic',
        weight: 30.0,
        temperature: 102.1,
        cost: 95.00,
        notes: 'Prescribed antibiotic ear drops. Follow-up in 2 weeks.',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: new mongoose_1.Types.ObjectId(),
        petId: pets_1.samplePets[1]._id,
        type: 'vaccination',
        title: 'FVRCP Vaccination',
        description: 'Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia',
        date: new Date('2024-02-10'),
        veterinarian: 'Dr. Sarah Wilson',
        clinic: 'Feline Health Center',
        nextDueDate: new Date('2025-02-10'),
        weight: 4.2,
        temperature: 101.8,
        cost: 75.00,
        notes: 'Vaccination completed successfully.',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: new mongoose_1.Types.ObjectId(),
        petId: pets_1.samplePets[1]._id,
        type: 'grooming',
        title: 'Professional Grooming',
        description: 'Full grooming service including bath, brush, and nail trim',
        date: new Date('2024-01-05'),
        veterinarian: 'Professional Groomer',
        clinic: 'Pet Spa & Grooming',
        weight: 4.1,
        cost: 60.00,
        notes: 'Coat in excellent condition. No matting found.',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: new mongoose_1.Types.ObjectId(),
        petId: pets_1.samplePets[2]._id,
        type: 'treatment',
        title: 'Arthritis Management',
        description: 'Joint pain assessment and treatment plan',
        date: new Date('2024-01-20'),
        veterinarian: 'Dr. Robert Davis',
        clinic: 'Senior Pet Care Clinic',
        weight: 35.0,
        temperature: 101.5,
        cost: 180.00,
        notes: 'Started on joint supplements and pain management protocol.',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: new mongoose_1.Types.ObjectId(),
        petId: pets_1.samplePets[2]._id,
        type: 'checkup',
        title: 'Senior Pet Wellness Exam',
        description: 'Comprehensive senior pet health evaluation',
        date: new Date('2023-12-15'),
        veterinarian: 'Dr. Robert Davis',
        clinic: 'Senior Pet Care Clinic',
        nextDueDate: new Date('2024-06-15'),
        weight: 34.8,
        temperature: 101.3,
        heartRate: 110,
        cost: 200.00,
        notes: 'Arthritis progression noted. Adjusted medication dosage.',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    }
];
module.exports = { sampleHealthRecords: exports.sampleHealthRecords };


/***/ }),

/***/ "./src/modules/seed/index.ts":
/*!***********************************!*\
  !*** ./src/modules/seed/index.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sampleMedications = exports.sampleHealthRecords = exports.samplePets = exports.sampleUsers = void 0;
const users_1 = __webpack_require__(/*! ./users */ "./src/modules/seed/users.ts");
Object.defineProperty(exports, "sampleUsers", ({ enumerable: true, get: function () { return users_1.sampleUsers; } }));
const pets_1 = __webpack_require__(/*! ./pets */ "./src/modules/seed/pets.ts");
Object.defineProperty(exports, "samplePets", ({ enumerable: true, get: function () { return pets_1.samplePets; } }));
const healthRecords_1 = __webpack_require__(/*! ./healthRecords */ "./src/modules/seed/healthRecords.ts");
Object.defineProperty(exports, "sampleHealthRecords", ({ enumerable: true, get: function () { return healthRecords_1.sampleHealthRecords; } }));
const medications_1 = __webpack_require__(/*! ./medications */ "./src/modules/seed/medications.ts");
Object.defineProperty(exports, "sampleMedications", ({ enumerable: true, get: function () { return medications_1.sampleMedications; } }));


/***/ }),

/***/ "./src/modules/seed/medications.ts":
/*!*****************************************!*\
  !*** ./src/modules/seed/medications.ts ***!
  \*****************************************/
/***/ ((module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sampleMedications = void 0;
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const pets_1 = __webpack_require__(/*! ./pets */ "./src/modules/seed/pets.ts");
exports.sampleMedications = [
    {
        _id: new mongoose_1.Types.ObjectId(),
        petId: pets_1.samplePets[0]._id,
        name: 'Heartgard Plus',
        dosage: '1 tablet',
        frequency: 'monthly',
        startDate: new Date('2024-01-01'),
        instructions: 'Give with food on the same date each month',
        veterinarian: 'Dr. Emily Johnson',
        isActive: true,
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: new mongoose_1.Types.ObjectId(),
        petId: pets_1.samplePets[0]._id,
        name: 'Antibiotic Ear Drops',
        dosage: '3 drops per ear',
        frequency: 'daily',
        startDate: new Date('2023-11-20'),
        endDate: new Date('2023-12-05'),
        instructions: 'Apply twice daily for 14 days',
        veterinarian: 'Dr. Michael Brown',
        isActive: false,
        isCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: new mongoose_1.Types.ObjectId(),
        petId: pets_1.samplePets[2]._id,
        name: 'Glucosamine Supplement',
        dosage: '2 tablets',
        frequency: 'daily',
        startDate: new Date('2024-01-20'),
        instructions: 'Give with morning meal',
        veterinarian: 'Dr. Robert Davis',
        isActive: true,
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: new mongoose_1.Types.ObjectId(),
        petId: pets_1.samplePets[2]._id,
        name: 'Carprofen',
        dosage: '75mg',
        frequency: 'daily',
        startDate: new Date('2024-01-20'),
        instructions: 'Give with food. Monitor for stomach upset.',
        veterinarian: 'Dr. Robert Davis',
        isActive: true,
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
    }
];
module.exports = { sampleMedications: exports.sampleMedications };


/***/ }),

/***/ "./src/modules/seed/pets.ts":
/*!**********************************!*\
  !*** ./src/modules/seed/pets.ts ***!
  \**********************************/
/***/ ((module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.samplePets = void 0;
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const users_1 = __webpack_require__(/*! ./users */ "./src/modules/seed/users.ts");
exports.samplePets = [
    {
        _id: new mongoose_1.Types.ObjectId(),
        name: 'Buddy',
        species: 'Dog',
        breed: 'Golden Retriever',
        age: 3,
        gender: 'Male',
        weight: 30.5,
        color: 'Golden',
        microchipId: 'MC123456789',
        ownerId: users_1.sampleUsers[0]._id,
        dateOfBirth: new Date('2021-03-15'),
        medicalNotes: 'Allergic to chicken. Prone to hip dysplasia.',
        emergencyContactName: 'Sarah Doe',
        emergencyContactPhone: '+1234567891',
        healthStatus: 'healthy',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: new mongoose_1.Types.ObjectId(),
        name: 'Whiskers',
        species: 'Cat',
        breed: 'Persian',
        age: 5,
        gender: 'Female',
        weight: 4.2,
        color: 'White',
        microchipId: 'MC987654321',
        ownerId: users_1.sampleUsers[1]._id,
        dateOfBirth: new Date('2019-07-22'),
        medicalNotes: 'Indoor cat. Regular grooming required.',
        emergencyContactName: 'Mike Smith',
        emergencyContactPhone: '+1987654322',
        healthStatus: 'healthy',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: new mongoose_1.Types.ObjectId(),
        name: 'Max',
        species: 'Dog',
        breed: 'German Shepherd',
        age: 7,
        gender: 'Male',
        weight: 35.0,
        color: 'Black and Tan',
        microchipId: 'MC456789123',
        ownerId: users_1.sampleUsers[0]._id,
        dateOfBirth: new Date('2017-01-10'),
        medicalNotes: 'Senior dog. Arthritis in hind legs.',
        emergencyContactName: 'Sarah Doe',
        emergencyContactPhone: '+1234567891',
        healthStatus: 'chronic',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    }
];
module.exports = { samplePets: exports.samplePets };


/***/ }),

/***/ "./src/modules/seed/seed.controller.ts":
/*!*********************************************!*\
  !*** ./src/modules/seed/seed.controller.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SeedController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const seed_service_1 = __webpack_require__(/*! ./seed.service */ "./src/modules/seed/seed.service.ts");
let SeedController = class SeedController {
    constructor(seedService) {
        this.seedService = seedService;
    }
    async seedDatabase() {
        return this.seedService.seedDatabase();
    }
};
exports.SeedController = SeedController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Seed database with sample data' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Database seeded successfully' }),
    (0, common_1.Post)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SeedController.prototype, "seedDatabase", null);
exports.SeedController = SeedController = __decorate([
    (0, swagger_1.ApiTags)('seed'),
    (0, common_1.Controller)('seed'),
    __metadata("design:paramtypes", [typeof (_a = typeof seed_service_1.SeedService !== "undefined" && seed_service_1.SeedService) === "function" ? _a : Object])
], SeedController);


/***/ }),

/***/ "./src/modules/seed/seed.module.ts":
/*!*****************************************!*\
  !*** ./src/modules/seed/seed.module.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SeedModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const seed_controller_1 = __webpack_require__(/*! ./seed.controller */ "./src/modules/seed/seed.controller.ts");
const seed_service_1 = __webpack_require__(/*! ./seed.service */ "./src/modules/seed/seed.service.ts");
const user_schema_1 = __webpack_require__(/*! ../auth/schemas/user.schema */ "./src/modules/auth/schemas/user.schema.ts");
let SeedModule = class SeedModule {
};
exports.SeedModule = SeedModule;
exports.SeedModule = SeedModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: user_schema_1.User.name, schema: user_schema_1.UserSchema }])],
        controllers: [seed_controller_1.SeedController],
        providers: [seed_service_1.SeedService],
    })
], SeedModule);


/***/ }),

/***/ "./src/modules/seed/seed.service.ts":
/*!******************************************!*\
  !*** ./src/modules/seed/seed.service.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SeedService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const user_schema_1 = __webpack_require__(/*! ../auth/schemas/user.schema */ "./src/modules/auth/schemas/user.schema.ts");
const index_1 = __webpack_require__(/*! ./index */ "./src/modules/seed/index.ts");
const mongoose_3 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_4 = __webpack_require__(/*! mongoose */ "mongoose");
let SeedService = class SeedService {
    constructor(userModel, connection) {
        this.userModel = userModel;
        this.connection = connection;
    }
    async seedDatabase() {
        try {
            const db = this.connection.db;
            await this.userModel.deleteMany({});
            await db.collection('pets').deleteMany({});
            await db.collection('healthrecords').deleteMany({});
            await db.collection('medications').deleteMany({});
            await this.userModel.insertMany(index_1.sampleUsers);
            await db.collection('pets').insertMany(index_1.samplePets);
            await db.collection('healthrecords').insertMany(index_1.sampleHealthRecords);
            await db.collection('medications').insertMany(index_1.sampleMedications);
            return {
                message: 'Database seeded successfully!',
                summary: {
                    users: index_1.sampleUsers.length,
                    pets: index_1.samplePets.length,
                    healthRecords: index_1.sampleHealthRecords.length,
                    medications: index_1.sampleMedications.length,
                },
            };
        }
        catch (error) {
            throw new Error(`Seeding failed: ${error.message}`);
        }
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_3.InjectConnection)()),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_4.Connection !== "undefined" && mongoose_4.Connection) === "function" ? _b : Object])
], SeedService);


/***/ }),

/***/ "./src/modules/seed/users.ts":
/*!***********************************!*\
  !*** ./src/modules/seed/users.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sampleUsers = void 0;
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const bcrypt = __webpack_require__(/*! bcrypt */ "bcrypt");
const sampleUsers = [
    {
        _id: new mongoose_1.Types.ObjectId(),
        email: 'john.doe@example.com',
        password: bcrypt.hashSync('password123', 12),
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        address: '123 Main St, City, State 12345',
        isActive: true,
        isEmailVerified: true,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: new mongoose_1.Types.ObjectId(),
        email: 'jane.smith@example.com',
        password: bcrypt.hashSync('password123', 12),
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+1987654321',
        address: '456 Oak Ave, City, State 67890',
        isActive: true,
        isEmailVerified: true,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
    }
];
exports.sampleUsers = sampleUsers;


/***/ }),

/***/ "./src/modules/symptom-checker/dto/symptom-check.dto.ts":
/*!**************************************************************!*\
  !*** ./src/modules/symptom-checker/dto/symptom-check.dto.ts ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SymptomCheckDto = exports.SeverityLevel = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
var SeverityLevel;
(function (SeverityLevel) {
    SeverityLevel[SeverityLevel["MILD"] = 1] = "MILD";
    SeverityLevel[SeverityLevel["MODERATE"] = 2] = "MODERATE";
    SeverityLevel[SeverityLevel["SEVERE"] = 3] = "SEVERE";
    SeverityLevel[SeverityLevel["CRITICAL"] = 4] = "CRITICAL";
})(SeverityLevel || (exports.SeverityLevel = SeverityLevel = {}));
class SymptomCheckDto {
}
exports.SymptomCheckDto = SymptomCheckDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Pet ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SymptomCheckDto.prototype, "petId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'List of symptoms observed' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SymptomCheckDto.prototype, "symptoms", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Duration of symptoms' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SymptomCheckDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Severity level', enum: SeverityLevel }),
    (0, class_validator_1.IsEnum)(SeverityLevel),
    __metadata("design:type", Number)
], SymptomCheckDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional information', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SymptomCheckDto.prototype, "additionalInfo", void 0);


/***/ }),

/***/ "./src/modules/symptom-checker/symptom-checker.controller.ts":
/*!*******************************************************************!*\
  !*** ./src/modules/symptom-checker/symptom-checker.controller.ts ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SymptomCheckerController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
const symptom_checker_service_1 = __webpack_require__(/*! ./symptom-checker.service */ "./src/modules/symptom-checker/symptom-checker.service.ts");
const symptom_check_dto_1 = __webpack_require__(/*! ./dto/symptom-check.dto */ "./src/modules/symptom-checker/dto/symptom-check.dto.ts");
let SymptomCheckerController = class SymptomCheckerController {
    constructor(symptomCheckerService) {
        this.symptomCheckerService = symptomCheckerService;
    }
    async checkSymptoms(req, symptomCheckDto) {
        return this.symptomCheckerService.checkSymptoms(req.user.userId, symptomCheckDto);
    }
};
exports.SymptomCheckerController = SymptomCheckerController;
__decorate([
    (0, common_1.Post)('check'),
    (0, swagger_1.ApiOperation)({ summary: 'AI-powered symptom analysis for pets' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof symptom_check_dto_1.SymptomCheckDto !== "undefined" && symptom_check_dto_1.SymptomCheckDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], SymptomCheckerController.prototype, "checkSymptoms", null);
exports.SymptomCheckerController = SymptomCheckerController = __decorate([
    (0, swagger_1.ApiTags)('symptom-checker'),
    (0, common_1.Controller)('symptom-checker'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [typeof (_a = typeof symptom_checker_service_1.SymptomCheckerService !== "undefined" && symptom_checker_service_1.SymptomCheckerService) === "function" ? _a : Object])
], SymptomCheckerController);


/***/ }),

/***/ "./src/modules/symptom-checker/symptom-checker.module.ts":
/*!***************************************************************!*\
  !*** ./src/modules/symptom-checker/symptom-checker.module.ts ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SymptomCheckerModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const symptom_checker_controller_1 = __webpack_require__(/*! ./symptom-checker.controller */ "./src/modules/symptom-checker/symptom-checker.controller.ts");
const symptom_checker_service_1 = __webpack_require__(/*! ./symptom-checker.service */ "./src/modules/symptom-checker/symptom-checker.service.ts");
const pet_schema_1 = __webpack_require__(/*! ../pets/schemas/pet.schema */ "./src/modules/pets/schemas/pet.schema.ts");
const health_record_schema_1 = __webpack_require__(/*! ../health-records/schemas/health-record.schema */ "./src/modules/health-records/schemas/health-record.schema.ts");
const medication_schema_1 = __webpack_require__(/*! ../medications/schemas/medication.schema */ "./src/modules/medications/schemas/medication.schema.ts");
let SymptomCheckerModule = class SymptomCheckerModule {
};
exports.SymptomCheckerModule = SymptomCheckerModule;
exports.SymptomCheckerModule = SymptomCheckerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: pet_schema_1.Pet.name, schema: pet_schema_1.PetSchema },
                { name: health_record_schema_1.HealthRecord.name, schema: health_record_schema_1.HealthRecordSchema },
                { name: medication_schema_1.Medication.name, schema: medication_schema_1.MedicationSchema },
            ]),
        ],
        controllers: [symptom_checker_controller_1.SymptomCheckerController],
        providers: [symptom_checker_service_1.SymptomCheckerService],
        exports: [symptom_checker_service_1.SymptomCheckerService],
    })
], SymptomCheckerModule);


/***/ }),

/***/ "./src/modules/symptom-checker/symptom-checker.service.ts":
/*!****************************************************************!*\
  !*** ./src/modules/symptom-checker/symptom-checker.service.ts ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SymptomCheckerService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const pet_schema_1 = __webpack_require__(/*! ../pets/schemas/pet.schema */ "./src/modules/pets/schemas/pet.schema.ts");
const health_record_schema_1 = __webpack_require__(/*! ../health-records/schemas/health-record.schema */ "./src/modules/health-records/schemas/health-record.schema.ts");
const medication_schema_1 = __webpack_require__(/*! ../medications/schemas/medication.schema */ "./src/modules/medications/schemas/medication.schema.ts");
let SymptomCheckerService = class SymptomCheckerService {
    constructor(petModel, healthRecordModel, medicationModel) {
        this.petModel = petModel;
        this.healthRecordModel = healthRecordModel;
        this.medicationModel = medicationModel;
    }
    async checkSymptoms(userId, symptomCheckDto) {
        const pet = await this.petModel.findById(symptomCheckDto.petId).exec();
        if (!pet || pet.ownerId.toString() !== userId) {
            throw new common_1.NotFoundException('Pet not found');
        }
        const healthRecords = await this.healthRecordModel
            .find({ petId: symptomCheckDto.petId, isActive: true })
            .sort({ date: -1 })
            .limit(10)
            .exec();
        const medications = await this.medicationModel
            .find({ petId: symptomCheckDto.petId, status: 'active' })
            .exec();
        const petContext = this.buildPetContext(pet, healthRecords, medications);
        const aiResponse = await this.callMistralAI(petContext, symptomCheckDto);
        return {
            petInfo: {
                name: pet.name,
                species: pet.species,
                breed: pet.breed,
                age: pet.age
            },
            analysis: aiResponse,
            timestamp: new Date()
        };
    }
    buildPetContext(pet, healthRecords, medications) {
        const context = `
Pet Information:
- Name: ${pet.name}
- Species: ${pet.species}
- Breed: ${pet.breed}
- Age: ${pet.age} years
- Gender: ${pet.gender}
- Weight: ${pet.weight || 'Not specified'} kg
- Current Health Status: ${pet.healthStatus}

Recent Medical History (Last 10 records):
${healthRecords.map(record => `- ${record.date.toDateString()}: ${record.type} - ${record.description}${record.notes ? ` (${record.notes})` : ''}`).join('\n')}

Current Medications:
${medications.length > 0 ?
            medications.map(med => `- ${med.name}: ${med.dosage} ${med.frequency} (${med.instructions})`).join('\n') :
            'No current medications'}`;
        return context;
    }
    async callMistralAI(petContext, symptomCheckDto) {
        const prompt = `You are a veterinary AI assistant. Based on the pet's medical history and current symptoms, provide a professional assessment.

${petContext}

Current Symptoms:
- Symptoms: ${symptomCheckDto.symptoms.join(', ')}
- Duration: ${symptomCheckDto.duration}
- Severity: ${symptomCheckDto.severity}/4
- Additional Info: ${symptomCheckDto.additionalInfo || 'None'}

Please provide:
1. Urgency level (Emergency, Urgent, Monitor, Normal)
2. Possible conditions (3-5 most likely)
3. Immediate recommendations
4. Whether veterinary consultation is needed
5. Warning signs to watch for

Format your response as JSON with these fields: urgencyLevel, possibleConditions, recommendations, vetRequired, warningSignsToWatch.`;
        try {
            const response = await fetch(`${process.env.MISTRAL_API_BASE}/v1/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'mistral-large-latest',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.3,
                    max_tokens: 1000
                })
            });
            const data = await response.json();
            const aiContent = data.choices[0].message.content;
            try {
                return JSON.parse(aiContent);
            }
            catch {
                return {
                    urgencyLevel: 'Monitor',
                    possibleConditions: ['Unable to parse AI response'],
                    recommendations: [aiContent],
                    vetRequired: true,
                    warningSignsToWatch: ['Monitor pet closely']
                };
            }
        }
        catch (error) {
            return {
                urgencyLevel: 'Monitor',
                possibleConditions: ['AI service unavailable'],
                recommendations: ['Please consult with a veterinarian for proper diagnosis'],
                vetRequired: true,
                warningSignsToWatch: ['Any worsening of symptoms']
            };
        }
    }
};
exports.SymptomCheckerService = SymptomCheckerService;
exports.SymptomCheckerService = SymptomCheckerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(pet_schema_1.Pet.name)),
    __param(1, (0, mongoose_1.InjectModel)(health_record_schema_1.HealthRecord.name)),
    __param(2, (0, mongoose_1.InjectModel)(medication_schema_1.Medication.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object])
], SymptomCheckerService);


/***/ }),

/***/ "./src/modules/user/dto/update-user.dto.ts":
/*!*************************************************!*\
  !*** ./src/modules/user/dto/update-user.dto.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateUserDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class UpdateUserDto {
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "lastName", void 0);


/***/ }),

/***/ "./src/modules/user/user.controller.ts":
/*!*********************************************!*\
  !*** ./src/modules/user/user.controller.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
const user_service_1 = __webpack_require__(/*! ./user.service */ "./src/modules/user/user.service.ts");
const update_user_dto_1 = __webpack_require__(/*! ./dto/update-user.dto */ "./src/modules/user/dto/update-user.dto.ts");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async getProfile(req) {
        return this.userService.findById(req.user._id);
    }
    async updateProfile(req, updateData) {
        return this.userService.updateProfile(req.user._id, updateData);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)('profile'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof update_user_dto_1.UpdateUserDto !== "undefined" && update_user_dto_1.UpdateUserDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateProfile", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _a : Object])
], UserController);


/***/ }),

/***/ "./src/modules/user/user.module.ts":
/*!*****************************************!*\
  !*** ./src/modules/user/user.module.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const user_controller_1 = __webpack_require__(/*! ./user.controller */ "./src/modules/user/user.controller.ts");
const user_service_1 = __webpack_require__(/*! ./user.service */ "./src/modules/user/user.service.ts");
const user_schema_1 = __webpack_require__(/*! ../auth/schemas/user.schema */ "./src/modules/auth/schemas/user.schema.ts");
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: user_schema_1.User.name, schema: user_schema_1.UserSchema }]),
        ],
        controllers: [user_controller_1.UserController],
        providers: [user_service_1.UserService],
        exports: [user_service_1.UserService],
    })
], UserModule);


/***/ }),

/***/ "./src/modules/user/user.service.ts":
/*!******************************************!*\
  !*** ./src/modules/user/user.service.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const user_schema_1 = __webpack_require__(/*! ../auth/schemas/user.schema */ "./src/modules/auth/schemas/user.schema.ts");
let UserService = class UserService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async findById(id) {
        return this.userModel.findById(id).select('-password').exec();
    }
    async updateProfile(id, updateData) {
        return this.userModel.findByIdAndUpdate(id, updateData, { new: true }).select('-password').exec();
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], UserService);


/***/ }),

/***/ "@nestjs/bull":
/*!*******************************!*\
  !*** external "@nestjs/bull" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("@nestjs/bull");

/***/ }),

/***/ "@nestjs/common":
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/config":
/*!*********************************!*\
  !*** external "@nestjs/config" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),

/***/ "@nestjs/core":
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/jwt":
/*!******************************!*\
  !*** external "@nestjs/jwt" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),

/***/ "@nestjs/mapped-types":
/*!***************************************!*\
  !*** external "@nestjs/mapped-types" ***!
  \***************************************/
/***/ ((module) => {

module.exports = require("@nestjs/mapped-types");

/***/ }),

/***/ "@nestjs/mongoose":
/*!***********************************!*\
  !*** external "@nestjs/mongoose" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@nestjs/mongoose");

/***/ }),

/***/ "@nestjs/passport":
/*!***********************************!*\
  !*** external "@nestjs/passport" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),

/***/ "@nestjs/schedule":
/*!***********************************!*\
  !*** external "@nestjs/schedule" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@nestjs/schedule");

/***/ }),

/***/ "@nestjs/swagger":
/*!**********************************!*\
  !*** external "@nestjs/swagger" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),

/***/ "class-validator":
/*!**********************************!*\
  !*** external "class-validator" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),

/***/ "nodemailer":
/*!*****************************!*\
  !*** external "nodemailer" ***!
  \*****************************/
/***/ ((module) => {

module.exports = require("nodemailer");

/***/ }),

/***/ "passport-jwt":
/*!*******************************!*\
  !*** external "passport-jwt" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),

/***/ "passport-local":
/*!*********************************!*\
  !*** external "passport-local" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("passport-local");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const app_module_1 = __webpack_require__(/*! ./app.module */ "./src/app.module.ts");
const path_1 = __webpack_require__(/*! path */ "path");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : ['log', 'error', 'warn', 'debug', 'verbose']
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.enableCors({
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true,
    });
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'));
    if (process.env.NODE_ENV !== 'production') {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('PawMundo API')
            .setDescription('The PawMundo API description')
            .setVersion('1.0')
            .addBearerAuth()
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api', app, document);
    }
    const port = parseInt(process.env.PORT || '3000', 10);
    await app.listen(port, '0.0.0.0');
    common_1.Logger.log(`PawMundo Backend running on port ${port}`, 'Bootstrap');
    if (process.env.NODE_ENV !== 'production') {
        common_1.Logger.log(`Swagger documentation available at http://localhost:${port}/api`, 'Bootstrap');
    }
}
bootstrap();

})();

/******/ })()
;