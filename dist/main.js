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
const ai_chat_module_1 = __webpack_require__(/*! @modules/ai-chat/ai-chat.module */ "./src/modules/ai-chat/ai-chat.module.ts");
const forum_module_1 = __webpack_require__(/*! @modules/forum/forum.module */ "./src/modules/forum/forum.module.ts");
const notifications_module_1 = __webpack_require__(/*! @modules/notifications/notifications.module */ "./src/modules/notifications/notifications.module.ts");
const activity_tracking_module_1 = __webpack_require__(/*! @modules/activity-tracking/activity-tracking.module */ "./src/modules/activity-tracking/activity-tracking.module.ts");
const events_module_1 = __webpack_require__(/*! @modules/events/events.module */ "./src/modules/events/events.module.ts");
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
            ai_chat_module_1.AiChatModule,
            forum_module_1.ForumModule,
            notifications_module_1.NotificationsModule,
            activity_tracking_module_1.ActivityTrackingModule,
            events_module_1.EventsModule,
            seed_module_1.SeedModule,
        ],
    })
], AppModule);


/***/ }),

/***/ "./src/common/decorators/roles.decorator.ts":
/*!**************************************************!*\
  !*** ./src/common/decorators/roles.decorator.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Roles = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const Roles = (...roles) => (0, common_1.SetMetadata)('roles', roles);
exports.Roles = Roles;


/***/ }),

/***/ "./src/common/filters/global-exception.filter.ts":
/*!*******************************************************!*\
  !*** ./src/common/filters/global-exception.filter.ts ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GlobalExceptionFilter_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GlobalExceptionFilter = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let GlobalExceptionFilter = GlobalExceptionFilter_1 = class GlobalExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(GlobalExceptionFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error occurred';
        let details = null;
        let suggestions = [];
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            }
            else if (typeof exceptionResponse === 'object') {
                const response = exceptionResponse;
                message = response.message || response.error || exception.message;
                details = response.details || null;
            }
            suggestions = this.getStatusSuggestions(status, message);
        }
        else if (this.isMongoError(exception)) {
            status = common_1.HttpStatus.BAD_REQUEST;
            message = this.getMongoErrorMessage(exception);
            suggestions = this.getMongoSuggestions(exception);
        }
        else if (exception instanceof Error) {
            console.log('🔥 Error details:', { name: exception.name, message: exception.message, stack: exception.stack });
            message = exception.message;
            suggestions = this.getGenericSuggestions(exception.message);
        }
        else {
            console.log('🔥 Unknown exception type:', typeof exception, exception);
        }
        console.log('🔥 Full exception:', exception);
        this.logger.error(`${request.method} ${request.url} - ${status} - ${message}`, exception instanceof Error ? exception.stack : 'Unknown error');
        const errorResponse = {
            success: false,
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message,
            ...(details && { details }),
            ...(suggestions.length > 0 && { suggestions }),
            ...(process.env.NODE_ENV === 'development' && {
                stack: exception instanceof Error ? exception.stack : undefined,
            }),
        };
        response.status(status).json(errorResponse);
    }
    getStatusSuggestions(status, message) {
        const suggestions = [];
        switch (status) {
            case common_1.HttpStatus.BAD_REQUEST:
                suggestions.push('Check your request data format and required fields');
                if (message.includes('validation')) {
                    suggestions.push('Ensure all required fields are provided with correct data types');
                }
                break;
            case common_1.HttpStatus.UNAUTHORIZED:
                suggestions.push('Make sure you are logged in and have a valid JWT token');
                suggestions.push('Check if your token has expired and refresh if needed');
                break;
            case common_1.HttpStatus.FORBIDDEN:
                suggestions.push('You do not have permission to access this resource');
                suggestions.push('Ensure you are accessing your own data or have proper authorization');
                break;
            case common_1.HttpStatus.NOT_FOUND:
                suggestions.push('Check if the resource ID is correct');
                suggestions.push('Verify the resource exists and you have access to it');
                break;
            case common_1.HttpStatus.CONFLICT:
                suggestions.push('The resource already exists or conflicts with existing data');
                suggestions.push('Try using different values or update the existing resource');
                break;
            case common_1.HttpStatus.UNPROCESSABLE_ENTITY:
                suggestions.push('Check your input data for validation errors');
                suggestions.push('Ensure all required fields meet the specified criteria');
                break;
        }
        return suggestions;
    }
    getMongoErrorMessage(error) {
        switch (error.code) {
            case 11000:
                const field = this.extractDuplicateField(error.message);
                return `Duplicate value detected for ${field}. This value already exists in the database.`;
            case 121:
                return 'Document validation failed. Please check your data format.';
            default:
                return `Database operation failed: ${error.message}`;
        }
    }
    getMongoSuggestions(error) {
        const suggestions = [];
        switch (error.code) {
            case 11000:
                suggestions.push('Use a different value for the duplicate field');
                suggestions.push('Check if you are trying to create a resource that already exists');
                break;
            case 121:
                suggestions.push('Ensure all required fields are provided');
                suggestions.push('Check that field values match the expected format');
                break;
            default:
                suggestions.push('Check your database connection');
                suggestions.push('Verify your data format matches the schema requirements');
        }
        return suggestions;
    }
    getGenericSuggestions(message) {
        const suggestions = [];
        if (message.includes('timeout')) {
            suggestions.push('The request timed out. Try again later.');
            suggestions.push('Check your internet connection.');
        }
        else if (message.includes('connection')) {
            suggestions.push('Database connection issue. Please try again.');
            suggestions.push('Contact support if the problem persists.');
        }
        else if (message.includes('validation')) {
            suggestions.push('Check your input data for validation errors.');
            suggestions.push('Ensure all required fields are provided correctly.');
        }
        return suggestions;
    }
    isMongoError(exception) {
        return exception &&
            typeof exception === 'object' &&
            (exception.name === 'MongoError' ||
                exception.code !== undefined);
    }
    extractDuplicateField(message) {
        const match = message.match(/index: (\w+)_/);
        return match ? match[1] : 'unknown field';
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = GlobalExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);


/***/ }),

/***/ "./src/common/guards/jwt-auth.guard.ts":
/*!*********************************************!*\
  !*** ./src/common/guards/jwt-auth.guard.ts ***!
  \*********************************************/
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

/***/ "./src/common/guards/roles.guard.ts":
/*!******************************************!*\
  !*** ./src/common/guards/roles.guard.ts ***!
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RolesGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
let RolesGuard = class RolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.get('roles', context.getHandler());
        if (!requiredRoles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user || !requiredRoles.includes(user.role)) {
            throw new common_1.ForbiddenException('You do not have permission to access this resource');
        }
        return true;
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object])
], RolesGuard);


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
            throw new common_1.BadRequestException(`Invalid ID format: '${error.value}' is not a valid MongoDB ObjectId`);
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err) => err.message);
            throw new common_1.BadRequestException(`Database validation failed: ${messages.join(', ')}`);
        }
        if (error.code === 11000) {
            throw new common_1.BadRequestException(`Duplicate entry: A record with this ${Object.keys(error.keyPattern || {}).join(', ')} already exists`);
        }
        if (error.name === 'DocumentNotFoundError') {
            throw new common_1.NotFoundException(`Database resource not found: The requested document does not exist`);
        }
        console.error(`${operation} failed:`, error);
        throw new common_1.InternalServerErrorException(`${operation} failed due to an unexpected database error. Please try again or contact support if the issue persists`);
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
            throw new common_1.BadRequestException(`Invalid ${fieldName} format: '${id}' is not a valid MongoDB ObjectId`);
        }
    }
    static validateDate(dateString, fieldName = 'date') {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            throw new common_1.BadRequestException(`Invalid ${fieldName} format: '${dateString}' is not a valid date. Use format: YYYY-MM-DD or ISO 8601`);
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

/***/ "./src/modules/activity-tracking/activity-tracking.controller.ts":
/*!***********************************************************************!*\
  !*** ./src/modules/activity-tracking/activity-tracking.controller.ts ***!
  \***********************************************************************/
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
exports.ActivityTrackingController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
const activity_tracking_service_1 = __webpack_require__(/*! ./activity-tracking.service */ "./src/modules/activity-tracking/activity-tracking.service.ts");
const create_activity_dto_1 = __webpack_require__(/*! ./dto/create-activity.dto */ "./src/modules/activity-tracking/dto/create-activity.dto.ts");
let ActivityTrackingController = class ActivityTrackingController {
    constructor(activityTrackingService) {
        this.activityTrackingService = activityTrackingService;
    }
    async create(req, createActivityDto) {
        const userId = req.user._id || req.user.id;
        return this.activityTrackingService.create(createActivityDto, userId);
    }
    async findByPet(petId, type) {
        return this.activityTrackingService.findByPet(petId, type);
    }
    async getDailyStats(petId, date) {
        return this.activityTrackingService.getDailyStats(petId, date);
    }
    async remove(id) {
        return this.activityTrackingService.delete(id);
    }
};
exports.ActivityTrackingController = ActivityTrackingController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Log a new pet activity',
        description: `
      Record a new activity for your pet such as walks, feeding, playtime, or water intake.
      
      **Activity Types:**
      - **walk**: Record walks with duration and distance
      - **play**: Log playtime and exercise sessions
      - **feeding**: Track meal times and food amounts
      - **water**: Monitor water intake
      - **exercise**: Record other exercise activities
      - **other**: Any other custom activity
      
      **Tips:**
      - For walks: Include duration (minutes) and distance (km)
      - For feeding: Specify food amount in grams
      - For water: Record amount in milliliters
      - Add notes for additional context
    `
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Activity logged successfully',
        schema: {
            example: {
                _id: '507f1f77bcf86cd799439011',
                petId: '507f1f77bcf86cd799439012',
                type: 'walk',
                date: '2024-01-15T10:30:00.000Z',
                duration: 30,
                distance: 2.5,
                notes: 'Morning walk in the park',
                isActive: true,
                createdAt: '2024-01-15T10:35:00.000Z',
                updatedAt: '2024-01-15T10:35:00.000Z'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Validation failed - Invalid activity data provided',
        schema: {
            example: {
                success: false,
                statusCode: 400,
                message: 'Validation failed for the provided data',
                details: [
                    {
                        property: 'type',
                        value: 'invalid_type',
                        constraints: {
                            isEnum: 'type must be one of the following values: walk, play, feeding, water, exercise, other'
                        }
                    }
                ],
                suggestions: [
                    'Use valid activity types: walk, play, feeding, water, exercise, other',
                    'Ensure all required fields (petId, type, date) are provided'
                ]
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing JWT token',
        schema: {
            example: {
                success: false,
                statusCode: 401,
                message: 'Unauthorized',
                suggestions: [
                    'Make sure you are logged in and have a valid JWT token',
                    'Check if your token has expired and refresh if needed'
                ]
            }
        }
    }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_activity_dto_1.CreateActivityDto !== "undefined" && create_activity_dto_1.CreateActivityDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], ActivityTrackingController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get all activities for a specific pet',
        description: `
      Retrieve all recorded activities for a pet, optionally filtered by activity type.
      Activities are returned in reverse chronological order (newest first).
      
      **Filter Options:**
      - No filter: Returns all activities
      - Type filter: Returns only activities of specified type
      
      **Common Use Cases:**
      - View all pet activities for health monitoring
      - Track specific activity types (e.g., only walks)
      - Generate activity reports and analytics
    `
    }),
    (0, swagger_1.ApiParam)({
        name: 'petId',
        description: 'Unique identifier of the pet',
        example: '507f1f77bcf86cd799439012'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'type',
        required: false,
        description: 'Filter activities by type',
        enum: ['walk', 'play', 'feeding', 'water', 'exercise', 'other'],
        example: 'walk'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of pet activities retrieved successfully',
        schema: {
            example: [
                {
                    _id: '507f1f77bcf86cd799439011',
                    petId: '507f1f77bcf86cd799439012',
                    type: 'walk',
                    date: '2024-01-15T10:30:00.000Z',
                    duration: 30,
                    distance: 2.5,
                    notes: 'Morning walk in the park'
                },
                {
                    _id: '507f1f77bcf86cd799439013',
                    petId: '507f1f77bcf86cd799439012',
                    type: 'feeding',
                    date: '2024-01-15T08:00:00.000Z',
                    foodAmount: 200,
                    notes: 'Breakfast - dry kibble'
                }
            ]
        }
    }),
    (0, common_1.Get)('pet/:petId'),
    __param(0, (0, common_1.Param)('petId')),
    __param(1, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ActivityTrackingController.prototype, "findByPet", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get daily activity statistics for a pet',
        description: `
      Get comprehensive daily statistics for a pet's activities on a specific date.
      
      **Statistics Include:**
      - Total number of walks
      - Total distance walked (km)
      - Number of feeding sessions
      - Total food consumed (grams)
      - Total water intake (ml)
      - List of all activities for the day
      
      **Use Cases:**
      - Daily health monitoring
      - Activity trend analysis
      - Veterinary reporting
      - Pet care insights
    `
    }),
    (0, swagger_1.ApiParam)({
        name: 'petId',
        description: 'Unique identifier of the pet',
        example: '507f1f77bcf86cd799439012'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'date',
        description: 'Date for statistics (YYYY-MM-DD format)',
        example: '2024-01-15'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Daily statistics retrieved successfully',
        schema: {
            example: {
                totalWalks: 2,
                totalDistance: 4.5,
                totalFeedings: 3,
                totalFoodAmount: 600,
                totalWaterIntake: 500,
                activities: [
                    {
                        _id: '507f1f77bcf86cd799439011',
                        type: 'walk',
                        date: '2024-01-15T10:30:00.000Z',
                        duration: 30,
                        distance: 2.5
                    }
                ]
            }
        }
    }),
    (0, common_1.Get)('pet/:petId/daily-stats'),
    __param(0, (0, common_1.Param)('petId')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ActivityTrackingController.prototype, "getDailyStats", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Delete an activity record',
        description: `
      Soft delete an activity record. The activity will be marked as inactive but not permanently removed.
      
      **Important Notes:**
      - This is a soft delete operation
      - Activity data is preserved for historical records
      - Only the activity owner can delete their records
      - Deleted activities won't appear in future queries
    `
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Unique identifier of the activity to delete',
        example: '507f1f77bcf86cd799439011'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Activity deleted successfully',
        schema: {
            example: {
                _id: '507f1f77bcf86cd799439011',
                petId: '507f1f77bcf86cd799439012',
                type: 'walk',
                isActive: false,
                updatedAt: '2024-01-15T11:00:00.000Z'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Activity not found',
        schema: {
            example: {
                success: false,
                statusCode: 404,
                message: "Activity with ID '507f1f77bcf86cd799439011' not found",
                suggestions: [
                    'Check if the activity ID is correct',
                    'Verify the activity exists and you have access to it'
                ]
            }
        }
    }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ActivityTrackingController.prototype, "remove", null);
exports.ActivityTrackingController = ActivityTrackingController = __decorate([
    (0, swagger_1.ApiTags)('Activity Tracking'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('activity-tracking'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof activity_tracking_service_1.ActivityTrackingService !== "undefined" && activity_tracking_service_1.ActivityTrackingService) === "function" ? _a : Object])
], ActivityTrackingController);


/***/ }),

/***/ "./src/modules/activity-tracking/activity-tracking.module.ts":
/*!*******************************************************************!*\
  !*** ./src/modules/activity-tracking/activity-tracking.module.ts ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ActivityTrackingModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const activity_tracking_controller_1 = __webpack_require__(/*! ./activity-tracking.controller */ "./src/modules/activity-tracking/activity-tracking.controller.ts");
const activity_tracking_service_1 = __webpack_require__(/*! ./activity-tracking.service */ "./src/modules/activity-tracking/activity-tracking.service.ts");
const activity_schema_1 = __webpack_require__(/*! ./schemas/activity.schema */ "./src/modules/activity-tracking/schemas/activity.schema.ts");
let ActivityTrackingModule = class ActivityTrackingModule {
};
exports.ActivityTrackingModule = ActivityTrackingModule;
exports.ActivityTrackingModule = ActivityTrackingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: activity_schema_1.Activity.name, schema: activity_schema_1.ActivitySchema }])
        ],
        controllers: [activity_tracking_controller_1.ActivityTrackingController],
        providers: [activity_tracking_service_1.ActivityTrackingService],
        exports: [activity_tracking_service_1.ActivityTrackingService]
    })
], ActivityTrackingModule);


/***/ }),

/***/ "./src/modules/activity-tracking/activity-tracking.service.ts":
/*!********************************************************************!*\
  !*** ./src/modules/activity-tracking/activity-tracking.service.ts ***!
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ActivityTrackingService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const activity_schema_1 = __webpack_require__(/*! ./schemas/activity.schema */ "./src/modules/activity-tracking/schemas/activity.schema.ts");
let ActivityTrackingService = class ActivityTrackingService {
    constructor(activityModel) {
        this.activityModel = activityModel;
    }
    async create(createActivityDto, userId) {
        const activityData = {
            ...createActivityDto,
            date: new Date(createActivityDto.date)
        };
        const activity = new this.activityModel(activityData);
        return activity.save();
    }
    async findByPet(petId, type) {
        const filter = { petId, isActive: true };
        if (type)
            filter.type = type;
        return this.activityModel.find(filter).sort({ date: -1 }).exec();
    }
    async findById(id) {
        const activity = await this.activityModel.findById(id).exec();
        if (!activity) {
            throw new common_1.NotFoundException(`Activity with ID '${id}' not found`);
        }
        return activity;
    }
    async delete(id) {
        const activity = await this.findById(id);
        return this.activityModel.findByIdAndUpdate(id, { isActive: false }, { new: true }).exec();
    }
    async getDailyStats(petId, date) {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);
        const activities = await this.activityModel.find({
            petId,
            date: { $gte: startDate, $lte: endDate },
            isActive: true
        }).exec();
        return {
            totalWalks: activities.filter(a => a.type === 'walk').length,
            totalDistance: activities.filter(a => a.type === 'walk').reduce((sum, a) => sum + (a.distance || 0), 0),
            totalFeedings: activities.filter(a => a.type === 'feeding').length,
            totalFoodAmount: activities.filter(a => a.type === 'feeding').reduce((sum, a) => sum + (a.foodAmount || 0), 0),
            totalWaterIntake: activities.filter(a => a.type === 'water').reduce((sum, a) => sum + (a.waterAmount || 0), 0),
            activities
        };
    }
};
exports.ActivityTrackingService = ActivityTrackingService;
exports.ActivityTrackingService = ActivityTrackingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(activity_schema_1.Activity.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], ActivityTrackingService);


/***/ }),

/***/ "./src/modules/activity-tracking/dto/create-activity.dto.ts":
/*!******************************************************************!*\
  !*** ./src/modules/activity-tracking/dto/create-activity.dto.ts ***!
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
exports.CreateActivityDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class CreateActivityDto {
}
exports.CreateActivityDto = CreateActivityDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Pet ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateActivityDto.prototype, "petId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Activity type',
        enum: ['walk', 'play', 'feeding', 'water', 'exercise', 'other']
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(['walk', 'play', 'feeding', 'water', 'exercise', 'other']),
    __metadata("design:type", String)
], CreateActivityDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Activity date', example: '2024-01-15T10:30:00Z' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateActivityDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Duration in minutes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateActivityDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Distance in km (for walks)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateActivityDto.prototype, "distance", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Food amount in grams' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateActivityDto.prototype, "foodAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Water amount in ml' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateActivityDto.prototype, "waterAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateActivityDto.prototype, "notes", void 0);


/***/ }),

/***/ "./src/modules/activity-tracking/schemas/activity.schema.ts":
/*!******************************************************************!*\
  !*** ./src/modules/activity-tracking/schemas/activity.schema.ts ***!
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
exports.ActivitySchema = exports.Activity = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
let Activity = class Activity extends mongoose_2.Document {
};
exports.Activity = Activity;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Pet', required: true }),
    __metadata("design:type", typeof (_a = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _a : Object)
], Activity.prototype, "petId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['walk', 'play', 'feeding', 'water', 'exercise', 'other'] }),
    __metadata("design:type", String)
], Activity.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Activity.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Activity.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Activity.prototype, "distance", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Activity.prototype, "foodAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Activity.prototype, "waterAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Activity.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Activity.prototype, "isActive", void 0);
exports.Activity = Activity = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Activity);
exports.ActivitySchema = mongoose_1.SchemaFactory.createForClass(Activity);
exports.ActivitySchema.index({ petId: 1, date: -1 });
exports.ActivitySchema.index({ petId: 1, type: 1, date: -1 });


/***/ }),

/***/ "./src/modules/ai-chat/ai-chat.controller.ts":
/*!***************************************************!*\
  !*** ./src/modules/ai-chat/ai-chat.controller.ts ***!
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AiChatController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
const ai_chat_service_1 = __webpack_require__(/*! ./ai-chat.service */ "./src/modules/ai-chat/ai-chat.service.ts");
const ai_chat_dto_1 = __webpack_require__(/*! ./dto/ai-chat.dto */ "./src/modules/ai-chat/dto/ai-chat.dto.ts");
let AiChatController = class AiChatController {
    constructor(aiChatService) {
        this.aiChatService = aiChatService;
    }
    async chat(req, aiChatDto) {
        return this.aiChatService.chat(req.user.userId, aiChatDto);
    }
    async getTypingIndicator() {
        return this.aiChatService.getTypingIndicator();
    }
    async getOfflineResponse(req, aiChatDto) {
        return this.aiChatService.getOfflineResponse(req.user.userId, aiChatDto.message);
    }
};
exports.AiChatController = AiChatController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'General AI chat with Mistral AI' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof ai_chat_dto_1.AiChatDto !== "undefined" && ai_chat_dto_1.AiChatDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], AiChatController.prototype, "chat", null);
__decorate([
    (0, common_1.Post)('typing'),
    (0, swagger_1.ApiOperation)({ summary: 'Get typing indicator' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AiChatController.prototype, "getTypingIndicator", null);
__decorate([
    (0, common_1.Post)('offline'),
    (0, swagger_1.ApiOperation)({ summary: 'Get offline response with user context' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_c = typeof ai_chat_dto_1.AiChatDto !== "undefined" && ai_chat_dto_1.AiChatDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], AiChatController.prototype, "getOfflineResponse", null);
exports.AiChatController = AiChatController = __decorate([
    (0, swagger_1.ApiTags)('ai-chat'),
    (0, common_1.Controller)('ai-chat'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [typeof (_a = typeof ai_chat_service_1.AiChatService !== "undefined" && ai_chat_service_1.AiChatService) === "function" ? _a : Object])
], AiChatController);


/***/ }),

/***/ "./src/modules/ai-chat/ai-chat.module.ts":
/*!***********************************************!*\
  !*** ./src/modules/ai-chat/ai-chat.module.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AiChatModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const ai_chat_controller_1 = __webpack_require__(/*! ./ai-chat.controller */ "./src/modules/ai-chat/ai-chat.controller.ts");
const ai_chat_service_1 = __webpack_require__(/*! ./ai-chat.service */ "./src/modules/ai-chat/ai-chat.service.ts");
const symptom_checker_service_1 = __webpack_require__(/*! ../symptom-checker/symptom-checker.service */ "./src/modules/symptom-checker/symptom-checker.service.ts");
const pets_service_1 = __webpack_require__(/*! ../pets/pets.service */ "./src/modules/pets/pets.service.ts");
const health_records_service_1 = __webpack_require__(/*! ../health-records/health-records.service */ "./src/modules/health-records/health-records.service.ts");
const appointments_service_1 = __webpack_require__(/*! ../appointments/appointments.service */ "./src/modules/appointments/appointments.service.ts");
const pet_schema_1 = __webpack_require__(/*! ../pets/schemas/pet.schema */ "./src/modules/pets/schemas/pet.schema.ts");
const health_record_schema_1 = __webpack_require__(/*! ../health-records/schemas/health-record.schema */ "./src/modules/health-records/schemas/health-record.schema.ts");
const appointment_schema_1 = __webpack_require__(/*! ../appointments/schemas/appointment.schema */ "./src/modules/appointments/schemas/appointment.schema.ts");
const medication_schema_1 = __webpack_require__(/*! ../medications/schemas/medication.schema */ "./src/modules/medications/schemas/medication.schema.ts");
const user_schema_1 = __webpack_require__(/*! ../auth/schemas/user.schema */ "./src/modules/auth/schemas/user.schema.ts");
const symptom_check_schema_1 = __webpack_require__(/*! ../symptom-checker/schemas/symptom-check.schema */ "./src/modules/symptom-checker/schemas/symptom-check.schema.ts");
let AiChatModule = class AiChatModule {
};
exports.AiChatModule = AiChatModule;
exports.AiChatModule = AiChatModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: pet_schema_1.Pet.name, schema: pet_schema_1.PetSchema },
                { name: health_record_schema_1.HealthRecord.name, schema: health_record_schema_1.HealthRecordSchema },
                { name: appointment_schema_1.Appointment.name, schema: appointment_schema_1.AppointmentSchema },
                { name: medication_schema_1.Medication.name, schema: medication_schema_1.MedicationSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: symptom_check_schema_1.SymptomCheck.name, schema: symptom_check_schema_1.SymptomCheckSchema },
            ]),
        ],
        controllers: [ai_chat_controller_1.AiChatController],
        providers: [ai_chat_service_1.AiChatService, symptom_checker_service_1.SymptomCheckerService, pets_service_1.PetsService, health_records_service_1.HealthRecordsService, appointments_service_1.AppointmentsService],
    })
], AiChatModule);


/***/ }),

/***/ "./src/modules/ai-chat/ai-chat.service.ts":
/*!************************************************!*\
  !*** ./src/modules/ai-chat/ai-chat.service.ts ***!
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AiChatService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const symptom_checker_service_1 = __webpack_require__(/*! ../symptom-checker/symptom-checker.service */ "./src/modules/symptom-checker/symptom-checker.service.ts");
const pets_service_1 = __webpack_require__(/*! ../pets/pets.service */ "./src/modules/pets/pets.service.ts");
const health_records_service_1 = __webpack_require__(/*! ../health-records/health-records.service */ "./src/modules/health-records/health-records.service.ts");
const appointments_service_1 = __webpack_require__(/*! ../appointments/appointments.service */ "./src/modules/appointments/appointments.service.ts");
const user_schema_1 = __webpack_require__(/*! ../auth/schemas/user.schema */ "./src/modules/auth/schemas/user.schema.ts");
let AiChatService = class AiChatService {
    constructor(symptomCheckerService, petsService, healthRecordsService, appointmentsService, userModel) {
        this.symptomCheckerService = symptomCheckerService;
        this.petsService = petsService;
        this.healthRecordsService = healthRecordsService;
        this.appointmentsService = appointmentsService;
        this.userModel = userModel;
    }
    async chat(userId, aiChatDto) {
        const { message, context } = aiChatDto;
        const [user, pets, upcomingAppointments] = await Promise.all([
            this.userModel.findById(userId).exec(),
            this.petsService.findByOwner(userId),
            this.appointmentsService.findUpcoming(userId)
        ]);
        const userName = user ? user.firstName : 'there';
        let petInfo = '';
        if (pets.length > 0) {
            const petDetails = [];
            for (const pet of pets) {
                try {
                    const [healthSummary, healthRecords] = await Promise.all([
                        this.healthRecordsService.getHealthSummary(pet._id.toString(), userId),
                        this.healthRecordsService.findByPet(pet._id.toString(), userId)
                    ]);
                    let petDetail = `${pet.name}: ${pet.species} ${pet.breed}, ${pet.age}yo, ${pet.gender}, ${pet.healthStatus}`;
                    if (pet.weight)
                        petDetail += `, ${pet.weight}kg`;
                    if (pet.color)
                        petDetail += `, ${pet.color}`;
                    if (pet.allergies?.length)
                        petDetail += `, allergies: ${pet.allergies.join(', ')}`;
                    if (pet.medicalNotes)
                        petDetail += `, notes: ${pet.medicalNotes}`;
                    petDetail += `. Health: ${healthSummary.totalRecords} records`;
                    if (healthSummary.lastCheckup)
                        petDetail += `, last checkup: ${new Date(healthSummary.lastCheckup).toLocaleDateString()}`;
                    if (healthSummary.upcomingCount)
                        petDetail += `, ${healthSummary.upcomingCount} upcoming`;
                    if (healthSummary.overdueCount)
                        petDetail += `, ${healthSummary.overdueCount} overdue`;
                    if (healthRecords.length > 0) {
                        const recentRecords = healthRecords.slice(0, 3).map(r => `${r.type}: ${r.title} (${new Date(r.date).toLocaleDateString()})`);
                        petDetail += `. Recent: ${recentRecords.join('; ')}`;
                    }
                    petDetails.push(petDetail);
                }
                catch (error) {
                    let petDetail = `${pet.name}: ${pet.species} ${pet.breed}, ${pet.age}yo, ${pet.gender}, ${pet.healthStatus}`;
                    if (pet.allergies?.length)
                        petDetail += `, allergies: ${pet.allergies.join(', ')}`;
                    petDetails.push(petDetail);
                }
            }
            petInfo = petDetails.join('\n\n');
        }
        else {
            petInfo = 'No pets registered';
        }
        let appointmentInfo = '';
        if (upcomingAppointments.length > 0) {
            const appointmentDetails = upcomingAppointments.map(apt => `${apt.petId?.name || 'Pet'}: ${apt.reason} with ${apt.vetName} at ${apt.vetClinic} on ${new Date(apt.appointmentDate).toLocaleDateString()} (${apt.status})`);
            appointmentInfo = `\n\nUpcoming Appointments: ${appointmentDetails.join('; ')}`;
        }
        const fullContext = `You are Dr. Woofson, a professional AI veterinarian. Be helpful and concise. Keep responses under 100 words. Address ${userName} by name. Reference specific pet details when relevant.

${petInfo}${appointmentInfo}
${context ? `Context: ${context}` : ''}`;
        const prompt = `${fullContext}\n\n${userName}: ${message}\n\nDr. Woofson (be brief and professional):`;
        try {
            const response = await fetch(`${process.env.MISTRAL_API_BASE || 'https://api.mistral.ai'}/v1/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'mistral-large-latest',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.7,
                    max_tokens: 150
                })
            });
            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error('Rate limit exceeded - too many requests');
                }
                throw new Error(`API Error: ${response.status}`);
            }
            const data = await response.json();
            const aiResponse = data.choices[0].message.content;
            return {
                response: aiResponse,
                typewriter: true,
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            console.error('AI Chat Error:', error);
            let fallbackResponse = `Hi ${userName}! `;
            if (pets && pets.length > 0) {
                fallbackResponse += `I can see your ${pets.length} pet${pets.length > 1 ? 's' : ''} (${pets.map(p => p.name).join(', ')}) but having connectivity issues. Please try again.`;
            }
            else {
                fallbackResponse += `I'm here to help with pet questions. Having connectivity issues - please try again.`;
            }
            return {
                response: fallbackResponse,
                typewriter: true,
                timestamp: new Date().toISOString()
            };
        }
    }
    async getTypingIndicator() {
        return {
            isTyping: true,
            message: 'Typing...',
            timestamp: new Date().toISOString()
        };
    }
    async getOfflineResponse(userId, message) {
        const [user, pets] = await Promise.all([
            this.userModel.findById(userId).exec(),
            this.petsService.findByOwner(userId)
        ]);
        const userName = user ? user.firstName : 'there';
        let response = `Hi ${userName}! `;
        if (pets.length > 0) {
            response += `I can see your ${pets.length} pet${pets.length > 1 ? 's' : ''} (${pets.map(p => p.name).join(', ')}) but having connectivity issues. Please try again.`;
        }
        else {
            response += `I'm here to help with pet questions. Having connectivity issues - please try again.`;
        }
        return {
            response,
            typewriter: true,
            timestamp: new Date().toISOString()
        };
    }
};
exports.AiChatService = AiChatService;
exports.AiChatService = AiChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(4, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof symptom_checker_service_1.SymptomCheckerService !== "undefined" && symptom_checker_service_1.SymptomCheckerService) === "function" ? _a : Object, typeof (_b = typeof pets_service_1.PetsService !== "undefined" && pets_service_1.PetsService) === "function" ? _b : Object, typeof (_c = typeof health_records_service_1.HealthRecordsService !== "undefined" && health_records_service_1.HealthRecordsService) === "function" ? _c : Object, typeof (_d = typeof appointments_service_1.AppointmentsService !== "undefined" && appointments_service_1.AppointmentsService) === "function" ? _d : Object, typeof (_e = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _e : Object])
], AiChatService);


/***/ }),

/***/ "./src/modules/ai-chat/dto/ai-chat.dto.ts":
/*!************************************************!*\
  !*** ./src/modules/ai-chat/dto/ai-chat.dto.ts ***!
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
exports.AiChatDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class AiChatDto {
}
exports.AiChatDto = AiChatDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User message' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AiChatDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Context for AI', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AiChatDto.prototype, "context", void 0);


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
            throw new common_1.NotFoundException(`Appointment with ID '${id}' does not exist`);
        if (userId && appointment.userId.toString() !== userId) {
            throw new common_1.ForbiddenException(`You don't have permission to access this appointment (ID: ${id}). This appointment belongs to another user.`);
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
                throw new common_1.ConflictException(`An account with email '${email}' already exists. Please use a different email or try logging in.`);
            }
            const hashedPassword = await bcrypt.hash(password, 12);
            const emailVerificationToken = crypto.randomBytes(32).toString('hex');
            user = new this.userModel({
                email,
                password: hashedPassword,
                firstName,
                lastName,
                role: registerDto.role || 'user',
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
        const payload = { email: user.email, sub: user._id, role: user.role };
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
                throw new common_1.UnauthorizedException(`Login failed: Invalid email or password. Please check your credentials and try again.`);
            }
            const lastLogin = new Date();
            await this.userModel.findByIdAndUpdate(user._id, { lastLogin });
            const payload = { email: user.email, sub: user._id, role: user.role };
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
            console.log('🔍 AuthService findById called with:', id, 'type:', typeof id);
            validation_util_1.ValidationUtil.validateObjectId(id, 'User ID');
            const user = await this.userModel.findById(id).select('-password -emailVerificationToken -passwordResetToken');
            console.log('🔍 AuthService findById result:', user ? 'User found' : 'User not found');
            if (user) {
                console.log('🔍 User _id:', user._id, 'type:', typeof user._id);
            }
            return user;
        }
        catch (error) {
            console.log('🔍 AuthService findById error:', error.message);
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
                throw new common_1.BadRequestException(`Password reset token is invalid or has expired. Please request a new password reset link.`);
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
                throw new common_1.UnauthorizedException(`User account not found. Please check if you're logged in correctly.`);
            }
            if (!(await bcrypt.compare(currentPassword, user.password))) {
                throw new common_1.UnauthorizedException(`Current password is incorrect. Please enter your current password correctly.`);
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
            throw new common_1.BadRequestException(`Email verification token is invalid or has already been used. Please request a new verification email.`);
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
    (0, swagger_1.ApiPropertyOptional)({ description: 'User role', enum: ['user', 'vet'], default: 'user' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['user', 'vet']),
    __metadata("design:type", String)
], RegisterDto.prototype, "role", void 0);
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
            throw new common_1.UnauthorizedException('User not found');
        }
        const userId = user._id.toString();
        return { _id: userId, userId, email: user.email, role: user.role };
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
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const consultations_service_1 = __webpack_require__(/*! ./consultations.service */ "./src/modules/consultations/consultations.service.ts");
const create_consultation_dto_1 = __webpack_require__(/*! ./dto/create-consultation.dto */ "./src/modules/consultations/dto/create-consultation.dto.ts");
const update_consultation_dto_1 = __webpack_require__(/*! ./dto/update-consultation.dto */ "./src/modules/consultations/dto/update-consultation.dto.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
const roles_guard_1 = __webpack_require__(/*! ../../common/guards/roles.guard */ "./src/common/guards/roles.guard.ts");
const roles_decorator_1 = __webpack_require__(/*! ../../common/decorators/roles.decorator */ "./src/common/decorators/roles.decorator.ts");
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
    getVetQueue() {
        return this.consultationsService.getVetQueue();
    }
    getVetActive(req) {
        return this.consultationsService.getVetActive(req.user.userId);
    }
    getVetHistory(req) {
        return this.consultationsService.getVetHistory(req.user.userId);
    }
    acceptConsultation(id, req) {
        return this.consultationsService.acceptConsultation(id, req.user.userId);
    }
    releaseConsultation(id, req) {
        return this.consultationsService.releaseConsultation(id, req.user.userId);
    }
};
exports.ConsultationsController = ConsultationsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new consultation request' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Consultation created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_consultation_dto_1.CreateConsultationDto !== "undefined" && create_consultation_dto_1.CreateConsultationDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], ConsultationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all consultations for the authenticated user' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: ['pending', 'assigned', 'in-progress', 'completed', 'cancelled'], description: 'Filter by consultation status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of consultations retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ConsultationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('upcoming'),
    (0, swagger_1.ApiOperation)({ summary: 'Get upcoming consultations for the authenticated user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Upcoming consultations retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ConsultationsController.prototype, "getUpcoming", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single consultation by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Consultation ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Consultation retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Consultation not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ConsultationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update consultation details' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Consultation ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Consultation updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Consultation not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_c = typeof update_consultation_dto_1.UpdateConsultationDto !== "undefined" && update_consultation_dto_1.UpdateConsultationDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], ConsultationsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel a consultation' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Consultation ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Consultation cancelled successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Consultation not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot cancel consultation in current status' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ConsultationsController.prototype, "cancel", null);
__decorate([
    (0, common_1.Patch)(':id/start'),
    (0, swagger_1.ApiOperation)({ summary: 'Start a consultation session with meeting link' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Consultation ID' }),
    (0, swagger_1.ApiBody)({ schema: { properties: { meetingLink: { type: 'string', example: 'https://meet.example.com/abc123' } } } }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Consultation started successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Consultation not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot start consultation in current status' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)('meetingLink')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", void 0)
], ConsultationsController.prototype, "startConsultation", null);
__decorate([
    (0, common_1.Patch)(':id/complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Complete a consultation with notes and optional prescription' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Consultation ID' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                notes: { type: 'string', example: 'Patient responded well to treatment' },
                prescription: { type: 'string', example: 'Amoxicillin 500mg twice daily for 7 days' }
            },
            required: ['notes']
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Consultation completed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Consultation not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot complete consultation in current status' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)('notes')),
    __param(3, (0, common_1.Body)('prescription')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String]),
    __metadata("design:returntype", void 0)
], ConsultationsController.prototype, "completeConsultation", null);
__decorate([
    (0, common_1.Get)('vet/queue'),
    (0, roles_decorator_1.Roles)('vet'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending consultations in the vet queue (Vet only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Queue retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Vet role required' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConsultationsController.prototype, "getVetQueue", null);
__decorate([
    (0, common_1.Get)('vet/active'),
    (0, roles_decorator_1.Roles)('vet'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active consultations assigned to the vet (Vet only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Active consultations retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Vet role required' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ConsultationsController.prototype, "getVetActive", null);
__decorate([
    (0, common_1.Get)('vet/history'),
    (0, roles_decorator_1.Roles)('vet'),
    (0, swagger_1.ApiOperation)({ summary: 'Get completed consultation history for the vet (Vet only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'History retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Vet role required' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ConsultationsController.prototype, "getVetHistory", null);
__decorate([
    (0, common_1.Post)(':id/accept'),
    (0, roles_decorator_1.Roles)('vet'),
    (0, swagger_1.ApiOperation)({ summary: 'Accept a consultation from the queue (Vet only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Consultation ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Consultation accepted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Consultation not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Consultation already assigned' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Vet role required' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ConsultationsController.prototype, "acceptConsultation", null);
__decorate([
    (0, common_1.Post)(':id/release'),
    (0, roles_decorator_1.Roles)('vet'),
    (0, swagger_1.ApiOperation)({ summary: 'Release a consultation back to the queue (Vet only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Consultation ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Consultation released successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Consultation not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Not assigned to this vet' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ConsultationsController.prototype, "releaseConsultation", null);
exports.ConsultationsController = ConsultationsController = __decorate([
    (0, swagger_1.ApiTags)('Consultations'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('consultations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof consultations_service_1.ConsultationsService !== "undefined" && consultations_service_1.ConsultationsService) === "function" ? _a : Object])
], ConsultationsController);


/***/ }),

/***/ "./src/modules/consultations/consultations.gateway.ts":
/*!************************************************************!*\
  !*** ./src/modules/consultations/consultations.gateway.ts ***!
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
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConsultationsGateway = void 0;
const websockets_1 = __webpack_require__(/*! @nestjs/websockets */ "@nestjs/websockets");
const socket_io_1 = __webpack_require__(/*! socket.io */ "socket.io");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const consultations_service_1 = __webpack_require__(/*! ./consultations.service */ "./src/modules/consultations/consultations.service.ts");
let ConsultationsGateway = class ConsultationsGateway {
    constructor(jwtService, consultationsService) {
        this.jwtService = jwtService;
        this.consultationsService = consultationsService;
        this.vetConnections = new Map();
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
            if (!token) {
                client.disconnect();
                return;
            }
            const payload = this.jwtService.verify(token);
            client.data.userId = payload.sub;
            client.data.role = payload.role;
            console.log(`Client connected: ${client.id}, userId: ${payload.sub}, role: ${payload.role}`);
        }
        catch (error) {
            console.error('Connection auth error:', error.message);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        if (client.data.role === 'vet') {
            this.vetConnections.delete(client.data.userId);
        }
        console.log(`Client disconnected: ${client.id}`);
    }
    async handleRegister(client, data) {
        if (data.role === 'veterinarian' && client.data.role === 'vet') {
            this.vetConnections.set(client.data.userId, client.id);
            return { success: true, message: 'Registered as available vet' };
        }
        return { success: false, error: 'Invalid role' };
    }
    async handleAccept(client, data) {
        try {
            if (client.data.role !== 'vet') {
                return { success: false, error: 'Only vets can accept consultations' };
            }
            const consultation = await this.consultationsService.acceptConsultation(data.consultationId, client.data.userId);
            this.server.emit('consultation:claimed', {
                consultationId: data.consultationId,
                vetId: client.data.userId,
                vetName: consultation.veterinarianName,
            });
            return { success: true, consultation };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async handleRelease(client, data) {
        try {
            if (client.data.role !== 'vet') {
                return { success: false, error: 'Only vets can release consultations' };
            }
            await this.consultationsService.releaseConsultation(data.consultationId, client.data.userId);
            this.server.emit('consultation:released', {
                consultationId: data.consultationId,
            });
            return { success: true };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    notifyNewConsultation(consultation) {
        this.server.emit('consultation:incoming', consultation);
    }
    notifyConsultationCompleted(consultationId) {
        this.server.emit('consultation:completed', { consultationId });
    }
    notifyConsultationUpdated(consultationId, updates) {
        this.server.emit('consultation:updated', { consultationId, ...updates });
    }
};
exports.ConsultationsGateway = ConsultationsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_c = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _c : Object)
], ConsultationsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('consultation:register'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _d : Object, Object]),
    __metadata("design:returntype", Promise)
], ConsultationsGateway.prototype, "handleRegister", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('consultation:accept'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _e : Object, Object]),
    __metadata("design:returntype", Promise)
], ConsultationsGateway.prototype, "handleAccept", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('consultation:release'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _f : Object, Object]),
    __metadata("design:returntype", Promise)
], ConsultationsGateway.prototype, "handleRelease", null);
exports.ConsultationsGateway = ConsultationsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: '*' }, namespace: '/consultations' }),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object, typeof (_b = typeof consultations_service_1.ConsultationsService !== "undefined" && consultations_service_1.ConsultationsService) === "function" ? _b : Object])
], ConsultationsGateway);


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
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const consultations_service_1 = __webpack_require__(/*! ./consultations.service */ "./src/modules/consultations/consultations.service.ts");
const consultations_controller_1 = __webpack_require__(/*! ./consultations.controller */ "./src/modules/consultations/consultations.controller.ts");
const consultations_gateway_1 = __webpack_require__(/*! ./consultations.gateway */ "./src/modules/consultations/consultations.gateway.ts");
const consultation_schema_1 = __webpack_require__(/*! ./schemas/consultation.schema */ "./src/modules/consultations/schemas/consultation.schema.ts");
const pets_module_1 = __webpack_require__(/*! ../pets/pets.module */ "./src/modules/pets/pets.module.ts");
let ConsultationsModule = class ConsultationsModule {
};
exports.ConsultationsModule = ConsultationsModule;
exports.ConsultationsModule = ConsultationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: consultation_schema_1.Consultation.name, schema: consultation_schema_1.ConsultationSchema }]),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'your-secret-key',
                signOptions: { expiresIn: '7d' },
            }),
            pets_module_1.PetsModule,
        ],
        controllers: [consultations_controller_1.ConsultationsController],
        providers: [consultations_service_1.ConsultationsService, consultations_gateway_1.ConsultationsGateway, core_1.Reflector],
        exports: [consultations_service_1.ConsultationsService, consultations_gateway_1.ConsultationsGateway],
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
            status: 'pending',
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
            throw new common_1.NotFoundException(`Consultation with ID '${id}' does not exist or you don't have permission to access it`);
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
    async getVetQueue() {
        return this.consultationModel
            .find({ status: 'pending', isActive: true })
            .populate('userId', 'firstName lastName email')
            .populate('petId', 'name species breed age')
            .sort({ scheduledDate: 1 });
    }
    async getVetActive(vetId) {
        return this.consultationModel
            .find({ assignedVet: new mongoose_2.Types.ObjectId(vetId), status: { $in: ['assigned', 'in-progress'] }, isActive: true })
            .populate('userId', 'firstName lastName email phone')
            .populate('petId', 'name species breed age weight')
            .sort({ scheduledDate: 1 });
    }
    async getVetHistory(vetId) {
        return this.consultationModel
            .find({ assignedVet: new mongoose_2.Types.ObjectId(vetId), status: 'completed', isActive: true })
            .populate('userId', 'firstName lastName')
            .populate('petId', 'name species')
            .sort({ updatedAt: -1 })
            .limit(50);
    }
    async acceptConsultation(consultationId, vetId) {
        const consultation = await this.consultationModel.findOne({ _id: consultationId, isActive: true });
        if (!consultation) {
            throw new common_1.NotFoundException('Consultation not found');
        }
        if (consultation.status !== 'pending') {
            throw new common_1.ConflictException('Consultation already assigned or completed');
        }
        consultation.assignedVet = new mongoose_2.Types.ObjectId(vetId);
        consultation.status = 'assigned';
        await consultation.save();
        return this.consultationModel
            .findById(consultationId)
            .populate('userId', 'firstName lastName email phone')
            .populate('petId', 'name species breed age weight');
    }
    async releaseConsultation(consultationId, vetId) {
        const consultation = await this.consultationModel.findOne({ _id: consultationId, isActive: true });
        if (!consultation) {
            throw new common_1.NotFoundException('Consultation not found');
        }
        if (consultation.assignedVet?.toString() !== vetId) {
            throw new common_1.ForbiddenException('You are not assigned to this consultation');
        }
        consultation.assignedVet = undefined;
        consultation.status = 'pending';
        await consultation.save();
        return consultation;
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
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateConsultationDto.prototype, "scheduledDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
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
    (0, class_validator_1.IsOptional)(),
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
var _a, _b, _c, _d, _e, _f;
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
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", typeof (_c = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _c : Object)
], Consultation.prototype, "assignedVet", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Consultation.prototype, "veterinarianName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['pending', 'assigned', 'in-progress', 'completed', 'cancelled'], default: 'pending' }),
    __metadata("design:type", String)
], Consultation.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], Consultation.prototype, "scheduledDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 30 }),
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
    __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
], Consultation.prototype, "followUpDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'video', enum: ['video', 'audio', 'chat'] }),
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
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Consultation.prototype, "unreadCount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", typeof (_f = typeof Date !== "undefined" && Date) === "function" ? _f : Object)
], Consultation.prototype, "lastMessageAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Consultation.prototype, "isActive", void 0);
exports.Consultation = Consultation = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Consultation);
exports.ConsultationSchema = mongoose_1.SchemaFactory.createForClass(Consultation);
exports.ConsultationSchema.index({ assignedVet: 1, status: 1 });
exports.ConsultationSchema.index({ status: 1, scheduledDate: 1 });


/***/ }),

/***/ "./src/modules/events/dto/create-event.dto.ts":
/*!****************************************************!*\
  !*** ./src/modules/events/dto/create-event.dto.ts ***!
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
exports.CreateEventDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class CreateEventDto {
}
exports.CreateEventDto = CreateEventDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Pet ID associated with the event' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "petId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Event title' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Event description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Event date' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "eventDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Event time' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "eventTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Event category', enum: ['appointment', 'vaccination', 'medication', 'grooming', 'training', 'other'] }),
    (0, class_validator_1.IsEnum)(['appointment', 'vaccination', 'medication', 'grooming', 'training', 'other']),
    __metadata("design:type", String)
], CreateEventDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Event location' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Is recurring event', default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateEventDto.prototype, "isRecurring", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Recurring type', enum: ['daily', 'weekly', 'monthly', 'yearly'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['daily', 'weekly', 'monthly', 'yearly']),
    __metadata("design:type", String)
], CreateEventDto.prototype, "recurringType", void 0);


/***/ }),

/***/ "./src/modules/events/dto/update-event.dto.ts":
/*!****************************************************!*\
  !*** ./src/modules/events/dto/update-event.dto.ts ***!
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
exports.UpdateEventDto = void 0;
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const create_event_dto_1 = __webpack_require__(/*! ./create-event.dto */ "./src/modules/events/dto/create-event.dto.ts");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_2 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class UpdateEventDto extends (0, swagger_1.PartialType)(create_event_dto_1.CreateEventDto) {
}
exports.UpdateEventDto = UpdateEventDto;
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ description: 'Event status', enum: ['scheduled', 'completed', 'cancelled'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['scheduled', 'completed', 'cancelled']),
    __metadata("design:type", String)
], UpdateEventDto.prototype, "status", void 0);


/***/ }),

/***/ "./src/modules/events/events.controller.ts":
/*!*************************************************!*\
  !*** ./src/modules/events/events.controller.ts ***!
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
const events_service_1 = __webpack_require__(/*! ./events.service */ "./src/modules/events/events.service.ts");
const create_event_dto_1 = __webpack_require__(/*! ./dto/create-event.dto */ "./src/modules/events/dto/create-event.dto.ts");
const update_event_dto_1 = __webpack_require__(/*! ./dto/update-event.dto */ "./src/modules/events/dto/update-event.dto.ts");
let EventsController = class EventsController {
    constructor(eventsService) {
        this.eventsService = eventsService;
    }
    async create(req, createEventDto) {
        try {
            console.log('📍 Create - req.user:', req.user);
            console.log('📍 Create - req.user._id:', req.user._id);
            return await this.eventsService.create(req.user._id, createEventDto);
        }
        catch (error) {
            console.error('Error creating event:', error);
            throw error;
        }
    }
    async findMyEvents(req) {
        console.log('📍 Controller - req.user:', req.user);
        console.log('📍 Controller - req.user._id:', req.user._id);
        return this.eventsService.findByUser(req.user._id);
    }
    async findUpcoming(req) {
        return this.eventsService.findUpcoming(req.user._id);
    }
    async findByCategory(req, category) {
        return this.eventsService.findByCategory(req.user._id, category);
    }
    async findOne(id, req) {
        return this.eventsService.findById(id, req.user._id);
    }
    async update(id, updateEventDto, req) {
        try {
            console.log('📝 Update event - id:', id);
            console.log('📝 Update event - userId:', req.user._id);
            console.log('📝 Update event - data:', updateEventDto);
            return await this.eventsService.update(id, req.user._id, updateEventDto);
        }
        catch (error) {
            console.error('❌ Error updating event:', error);
            throw error;
        }
    }
    async remove(id, req) {
        return this.eventsService.delete(id, req.user._id);
    }
};
exports.EventsController = EventsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a new event' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Event created successfully' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_event_dto_1.CreateEventDto !== "undefined" && create_event_dto_1.CreateEventDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all user events' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of user events' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "findMyEvents", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get upcoming events' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of upcoming events' }),
    (0, common_1.Get)('upcoming'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "findUpcoming", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get events by category' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of events by category' }),
    (0, swagger_1.ApiQuery)({ name: 'category', enum: ['appointment', 'vaccination', 'medication', 'grooming', 'training', 'other'] }),
    (0, common_1.Get)('category'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "findByCategory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get event by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Event details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Event not found' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update event' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Event updated successfully' }),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof update_event_dto_1.UpdateEventDto !== "undefined" && update_event_dto_1.UpdateEventDto) === "function" ? _c : Object, Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete event' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Event deleted successfully' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "remove", null);
exports.EventsController = EventsController = __decorate([
    (0, swagger_1.ApiTags)('events'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('events'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof events_service_1.EventsService !== "undefined" && events_service_1.EventsService) === "function" ? _a : Object])
], EventsController);


/***/ }),

/***/ "./src/modules/events/events.module.ts":
/*!*********************************************!*\
  !*** ./src/modules/events/events.module.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const events_controller_1 = __webpack_require__(/*! ./events.controller */ "./src/modules/events/events.controller.ts");
const events_service_1 = __webpack_require__(/*! ./events.service */ "./src/modules/events/events.service.ts");
const event_schema_1 = __webpack_require__(/*! ./schemas/event.schema */ "./src/modules/events/schemas/event.schema.ts");
let EventsModule = class EventsModule {
};
exports.EventsModule = EventsModule;
exports.EventsModule = EventsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: event_schema_1.Event.name, schema: event_schema_1.EventSchema }]),
        ],
        controllers: [events_controller_1.EventsController],
        providers: [events_service_1.EventsService],
        exports: [events_service_1.EventsService],
    })
], EventsModule);


/***/ }),

/***/ "./src/modules/events/events.service.ts":
/*!**********************************************!*\
  !*** ./src/modules/events/events.service.ts ***!
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const event_schema_1 = __webpack_require__(/*! ./schemas/event.schema */ "./src/modules/events/schemas/event.schema.ts");
let EventsService = class EventsService {
    constructor(eventModel) {
        this.eventModel = eventModel;
    }
    async create(userId, createEventDto) {
        console.log('📝 Creating event with data:', { userId, createEventDto });
        const event = new this.eventModel({
            ...createEventDto,
            userId: new mongoose_2.Types.ObjectId(userId),
            petId: createEventDto.petId ? new mongoose_2.Types.ObjectId(createEventDto.petId) : undefined,
        });
        const saved = await event.save();
        console.log('✅ Event saved:', saved);
        return saved;
    }
    async findByUser(userId) {
        console.log('🔍 Finding events for user:', userId);
        const query = { userId: new mongoose_2.Types.ObjectId(userId), isActive: true };
        console.log('🔍 Query:', query);
        const allEvents = await this.eventModel.find({}).exec();
        console.log('📊 Total events in DB:', allEvents.length);
        console.log('📊 All events:', allEvents);
        const events = await this.eventModel
            .find(query)
            .populate('petId', 'name breed')
            .sort({ eventDate: 1 })
            .exec();
        console.log('📋 Found events for user:', events.length);
        console.log('📋 Events:', events);
        return events;
    }
    async findUpcoming(userId) {
        const today = new Date();
        return this.eventModel
            .find({
            userId: new mongoose_2.Types.ObjectId(userId),
            eventDate: { $gte: today },
            status: 'scheduled',
            isActive: true,
        })
            .populate('petId', 'name breed')
            .sort({ eventDate: 1 })
            .limit(10)
            .exec();
    }
    async findById(id, userId) {
        const event = await this.eventModel
            .findOne({ _id: new mongoose_2.Types.ObjectId(id), userId: new mongoose_2.Types.ObjectId(userId), isActive: true })
            .populate('petId', 'name breed')
            .exec();
        if (!event) {
            throw new common_1.NotFoundException('Event not found');
        }
        return event;
    }
    async update(id, userId, updateEventDto) {
        try {
            console.log('🔄 Updating event:', { id, userId, updateEventDto });
            const updateData = { ...updateEventDto };
            if (updateEventDto.petId) {
                updateData.petId = new mongoose_2.Types.ObjectId(updateEventDto.petId);
            }
            const event = await this.eventModel
                .findOneAndUpdate({ _id: new mongoose_2.Types.ObjectId(id), userId: new mongoose_2.Types.ObjectId(userId), isActive: true }, updateData, { new: true })
                .populate('petId', 'name breed')
                .exec();
            if (!event) {
                throw new common_1.NotFoundException('Event not found');
            }
            console.log('✅ Event updated:', event);
            return event;
        }
        catch (error) {
            console.error('❌ Update error:', error);
            throw error;
        }
    }
    async delete(id, userId) {
        const result = await this.eventModel
            .findOneAndUpdate({ _id: new mongoose_2.Types.ObjectId(id), userId: new mongoose_2.Types.ObjectId(userId) }, { isActive: false }, { new: true })
            .exec();
        if (!result) {
            throw new common_1.NotFoundException('Event not found');
        }
    }
    async findByCategory(userId, category) {
        return this.eventModel
            .find({ userId: new mongoose_2.Types.ObjectId(userId), category, isActive: true })
            .populate('petId', 'name breed')
            .sort({ eventDate: 1 })
            .exec();
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(event_schema_1.Event.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], EventsService);


/***/ }),

/***/ "./src/modules/events/schemas/event.schema.ts":
/*!****************************************************!*\
  !*** ./src/modules/events/schemas/event.schema.ts ***!
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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventSchema = exports.Event = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
let Event = class Event {
};
exports.Event = Event;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", typeof (_a = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _a : Object)
], Event.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Pet' }),
    __metadata("design:type", typeof (_b = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _b : Object)
], Event.prototype, "petId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Event.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Event.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Event.prototype, "eventDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Event.prototype, "eventTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['appointment', 'vaccination', 'medication', 'grooming', 'training', 'other'] }),
    __metadata("design:type", String)
], Event.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'scheduled', enum: ['scheduled', 'completed', 'cancelled'] }),
    __metadata("design:type", String)
], Event.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Event.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Event.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Event.prototype, "isRecurring", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['daily', 'weekly', 'monthly', 'yearly'] }),
    __metadata("design:type", String)
], Event.prototype, "recurringType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Event.prototype, "isActive", void 0);
exports.Event = Event = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Event);
exports.EventSchema = mongoose_1.SchemaFactory.createForClass(Event);


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
            throw new common_1.NotFoundException(`Forum post with ID '${id}' does not exist or has been deleted`);
        }
        return post;
    }
    async toggleLike(postId, userId) {
        const userObjectId = new mongoose_2.Types.ObjectId(userId);
        const post = await this.forumPostModel.findById(postId);
        if (!post) {
            throw new common_1.NotFoundException(`Forum post with ID '${postId}' does not exist or has been deleted`);
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
            throw new common_1.NotFoundException(`Forum post with ID '${postId}' does not exist or has been deleted`);
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
            throw new common_1.NotFoundException(`Forum post with ID '${id}' does not exist or has been deleted`);
        }
        if (!post.authorId.equals(new mongoose_2.Types.ObjectId(userId))) {
            throw new common_1.ForbiddenException(`You don't have permission to edit this forum post. You can only edit posts that you created.`);
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
            throw new common_1.NotFoundException(`Forum post with ID '${id}' does not exist or has been deleted`);
        }
        if (!post.authorId.equals(new mongoose_2.Types.ObjectId(userId))) {
            throw new common_1.ForbiddenException(`You don't have permission to delete this forum post. You can only delete posts that you created.`);
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
        enum: ['vaccination', 'checkup', 'surgery', 'medication', 'treatment', 'emergency', 'grooming', 'other']
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(['vaccination', 'checkup', 'surgery', 'medication', 'treatment', 'emergency', 'grooming', 'other']),
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
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Is this a reminder' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateHealthRecordDto.prototype, "isReminder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Is reminder completed' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateHealthRecordDto.prototype, "isCompleted", void 0);


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
        console.log('📝 Create health record DTO:', createDto);
        console.log('👤 User ID:', req.user.userId);
        try {
            const healthRecordData = {
                ...createDto,
                petId: new mongoose_1.Types.ObjectId(createDto.petId),
                date: new Date(createDto.date),
                nextDueDate: createDto.nextDueDate ? new Date(createDto.nextDueDate) : undefined
            };
            console.log('✅ Processed data:', healthRecordData);
            return await this.healthRecordsService.create(req.user.userId, healthRecordData);
        }
        catch (error) {
            console.error('❌ Controller error:', error);
            throw error;
        }
    }
    async findByPet(petId, type, req) {
        return this.healthRecordsService.findByPet(petId, req.user.userId, type);
    }
    async getUpcomingReminders(req) {
        return this.healthRecordsService.getUpcomingReminders(req.user.userId);
    }
    async getVaccinations(petId, req) {
        return this.healthRecordsService.getVaccinations(petId, req.user.userId);
    }
    async getHealthSummary(petId, req) {
        return this.healthRecordsService.getHealthSummary(petId, req.user.userId);
    }
    async findOne(id, req) {
        return this.healthRecordsService.findById(id, req.user.userId);
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
        return this.healthRecordsService.update(id, req.user.userId, healthRecordData);
    }
    async remove(id, req) {
        return this.healthRecordsService.delete(id, req.user.userId);
    }
    async getOverdueReminders(req) {
        return this.healthRecordsService.getOverdueReminders(req.user.userId);
    }
    async addAttachment(id, url, req) {
        return this.healthRecordsService.addAttachment(id, req.user.userId, url);
    }
    async removeAttachment(id, url, req) {
        return this.healthRecordsService.removeAttachment(id, req.user.userId, url);
    }
    async getRecordsByDateRange(petId, startDate, endDate, req) {
        return this.healthRecordsService.getRecordsByDateRange(petId, req.user.userId, new Date(startDate), new Date(endDate));
    }
    async getHealthAnalytics(req) {
        return this.healthRecordsService.getHealthAnalytics(req.user.userId);
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
        try {
            const petIdStr = recordData.petId?.toString();
            if (petIdStr) {
                await this.petsService.findById(petIdStr, userId);
            }
            const record = new this.healthRecordModel(recordData);
            return await record.save();
        }
        catch (error) {
            console.error('Error creating health record:', error);
            throw error;
        }
    }
    async findByPet(petId, userId, type) {
        await this.petsService.findById(petId, userId);
        const { Types } = __webpack_require__(/*! mongoose */ "mongoose");
        const filter = { petId: new Types.ObjectId(petId), isActive: true };
        if (type)
            filter.type = type;
        const records = await this.healthRecordModel.find(filter).sort({ date: -1 }).exec();
        return records;
    }
    async findById(id, userId) {
        const { Types } = __webpack_require__(/*! mongoose */ "mongoose");
        const record = await this.healthRecordModel.findOne({ _id: id, isActive: true }).populate({
            path: 'petId',
            match: { ownerId: new Types.ObjectId(userId), isActive: true }
        }).exec();
        if (!record || !record.petId)
            throw new common_1.NotFoundException(`Health record with ID '${id}' does not exist or you don't have permission to access it`);
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
        const { Types } = __webpack_require__(/*! mongoose */ "mongoose");
        return this.healthRecordModel
            .find({
            nextDueDate: { $gte: today, $lte: nextMonth },
            isReminder: true,
            isActive: true
        })
            .populate({
            path: 'petId',
            match: { ownerId: new Types.ObjectId(userId), isActive: true },
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
        const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const { Types } = __webpack_require__(/*! mongoose */ "mongoose");
        return this.healthRecordModel
            .find({
            nextDueDate: { $lt: today, $gte: sevenDaysAgo },
            isReminder: true,
            isActive: true
        })
            .populate({
            path: 'petId',
            match: { ownerId: new Types.ObjectId(userId), isActive: true },
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
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], HealthRecord.prototype, "isCompleted", void 0);
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
        return this.healthRemindersService.getRemindersForUser(req.user.userId);
    }
    async createVaccinationReminders(petId, req) {
        return this.healthRemindersService.createVaccinationReminders(petId, req.user.userId);
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
const notifications_module_1 = __webpack_require__(/*! ../notifications/notifications.module */ "./src/modules/notifications/notifications.module.ts");
let HealthRemindersModule = class HealthRemindersModule {
};
exports.HealthRemindersModule = HealthRemindersModule;
exports.HealthRemindersModule = HealthRemindersModule = __decorate([
    (0, common_1.Module)({
        imports: [health_records_module_1.HealthRecordsModule, pets_module_1.PetsModule, notifications_module_1.NotificationsModule],
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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HealthRemindersService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const schedule_1 = __webpack_require__(/*! @nestjs/schedule */ "@nestjs/schedule");
const health_records_service_1 = __webpack_require__(/*! ../health-records/health-records.service */ "./src/modules/health-records/health-records.service.ts");
const pets_service_1 = __webpack_require__(/*! ../pets/pets.service */ "./src/modules/pets/pets.service.ts");
const notifications_service_1 = __webpack_require__(/*! ../notifications/notifications.service */ "./src/modules/notifications/notifications.service.ts");
let HealthRemindersService = class HealthRemindersService {
    constructor(healthRecordsService, petsService, notificationsService) {
        this.healthRecordsService = healthRecordsService;
        this.petsService = petsService;
        this.notificationsService = notificationsService;
    }
    async sendDailyReminders() {
        console.log('Checking for health reminders...');
    }
    async getRemindersForUser(userId) {
        console.log('🔍 Getting reminders for userId:', userId);
        const userPets = await this.petsService.findByOwner(userId);
        console.log('🐾 User pets:', userPets.length);
        const [upcoming, overdue] = await Promise.all([
            this.healthRecordsService.getUpcomingReminders(userId),
            this.healthRecordsService.getOverdueReminders(userId),
        ]);
        console.log('📅 Upcoming records:', upcoming.length);
        console.log('⏰ Overdue records:', overdue.length);
        for (const record of overdue) {
            const petId = record.petId?._id || record.petId;
            const petName = record.petId?.name || 'Your pet';
            const daysOverdue = Math.ceil((Date.now() - record.nextDueDate.getTime()) / (1000 * 60 * 60 * 24));
            try {
                await this.notificationsService.create({
                    userId,
                    petId: petId?.toString(),
                    title: `${record.title} Overdue`,
                    message: `${petName}'s ${record.title} is ${daysOverdue} days overdue`,
                    type: 'reminder',
                    actionUrl: `/pet/${petId}?tab=health`,
                });
            }
            catch (error) {
            }
        }
        for (const record of upcoming) {
            const daysUntil = Math.ceil((record.nextDueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            if (daysUntil <= 3) {
                const petId = record.petId?._id || record.petId;
                const petName = record.petId?.name || 'Your pet';
                try {
                    await this.notificationsService.create({
                        userId,
                        petId: petId?.toString(),
                        title: `${record.title} Due Soon`,
                        message: `${petName}'s ${record.title} is due in ${daysUntil} days`,
                        type: 'reminder',
                        actionUrl: `/pet/${petId}?tab=health`,
                    });
                }
                catch (error) {
                }
            }
        }
        return {
            upcoming: upcoming.map(record => ({
                id: record._id,
                petId: record.petId?._id || record.petId,
                petName: record.petId?.name || 'Unknown',
                type: record.type,
                title: record.title,
                dueDate: record.nextDueDate,
                daysUntilDue: Math.ceil((record.nextDueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
            })),
            overdue: overdue.map(record => ({
                id: record._id,
                petId: record.petId?._id || record.petId,
                petName: record.petId?.name || 'Unknown',
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
    __metadata("design:paramtypes", [typeof (_a = typeof health_records_service_1.HealthRecordsService !== "undefined" && health_records_service_1.HealthRecordsService) === "function" ? _a : Object, typeof (_b = typeof pets_service_1.PetsService !== "undefined" && pets_service_1.PetsService) === "function" ? _b : Object, typeof (_c = typeof notifications_service_1.NotificationsService !== "undefined" && notifications_service_1.NotificationsService) === "function" ? _c : Object])
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
            throw new common_1.BadRequestException(`Invalid date range: Start date (${createInsuranceDto.startDate}) must be before end date (${createInsuranceDto.endDate})`);
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
            throw new common_1.NotFoundException(`Insurance policy with ID '${id}' does not exist`);
        }
        if (userId && insurance.userId.toString() !== userId) {
            throw new common_1.ForbiddenException(`You don't have permission to access insurance policy '${id}'. This policy belongs to another user.`);
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
            throw new common_1.BadRequestException(`Invalid insurance status '${status}'. Valid options are: ${validStatuses.join(', ')}`);
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
            throw new common_1.BadRequestException(`Cannot submit claim for insurance policy '${claimDto.insuranceId}' because it has status '${insurance.status}'. Only active policies can accept claims.`);
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
            throw new common_1.NotFoundException(`Insurance claim with ID '${claimId}' does not exist`);
        }
        if (claim.userId.toString() !== userId) {
            throw new common_1.ForbiddenException(`You don't have permission to access insurance claim '${claimId}'. This claim belongs to another user.`);
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
                throw new common_1.NotFoundException(`Medication with ID '${id}' does not exist`);
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

/***/ "./src/modules/notifications/dto/update-preference.dto.ts":
/*!****************************************************************!*\
  !*** ./src/modules/notifications/dto/update-preference.dto.ts ***!
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
exports.UpdatePreferenceDto = exports.PetNotificationSettingsDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class PetNotificationSettingsDto {
}
exports.PetNotificationSettingsDto = PetNotificationSettingsDto;
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], PetNotificationSettingsDto.prototype, "appointments", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], PetNotificationSettingsDto.prototype, "medications", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], PetNotificationSettingsDto.prototype, "vaccinations", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], PetNotificationSettingsDto.prototype, "checkups", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], PetNotificationSettingsDto.prototype, "healthAlerts", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], PetNotificationSettingsDto.prototype, "weightChanges", void 0);
class UpdatePreferenceDto {
}
exports.UpdatePreferenceDto = UpdatePreferenceDto;
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdatePreferenceDto.prototype, "globalEnabled", void 0);
__decorate([
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePreferenceDto.prototype, "petId", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", PetNotificationSettingsDto)
], UpdatePreferenceDto.prototype, "petSettings", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdatePreferenceDto.prototype, "emailNotifications", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdatePreferenceDto.prototype, "pushNotifications", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdatePreferenceDto.prototype, "reminderHoursBefore", void 0);


/***/ }),

/***/ "./src/modules/notifications/notifications.controller.ts":
/*!***************************************************************!*\
  !*** ./src/modules/notifications/notifications.controller.ts ***!
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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const notifications_service_1 = __webpack_require__(/*! ./notifications.service */ "./src/modules/notifications/notifications.service.ts");
const update_preference_dto_1 = __webpack_require__(/*! ./dto/update-preference.dto */ "./src/modules/notifications/dto/update-preference.dto.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../../common/guards/jwt-auth.guard */ "./src/common/guards/jwt-auth.guard.ts");
let NotificationsController = class NotificationsController {
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    async getNotifications(req, petId) {
        return this.notificationsService.findAllByUser(req.user.userId, petId);
    }
    async getUnreadCount(req) {
        const count = await this.notificationsService.getUnreadCount(req.user.userId);
        return { count };
    }
    async markAsRead(id, req) {
        return this.notificationsService.markAsRead(id, req.user.userId);
    }
    async markAllAsRead(req) {
        await this.notificationsService.markAllAsRead(req.user.userId);
        return { success: true };
    }
    async getPreferences(req) {
        return this.notificationsService.getPreferences(req.user.userId);
    }
    async updatePreferences(req, updateDto) {
        try {
            return await this.notificationsService.updatePreferences(req.user.userId, updateDto);
        }
        catch (error) {
            console.error('Update preferences error:', error);
            throw error;
        }
    }
    async removeDuplicates(req) {
        const count = await this.notificationsService.removeDuplicates(req.user.userId);
        return { success: true, removed: count };
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('petId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Get)('unread-count'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Patch)(':id/read'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Patch)('read-all'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAllAsRead", null);
__decorate([
    (0, common_1.Get)('preferences'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getPreferences", null);
__decorate([
    (0, common_1.Patch)('preferences'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof update_preference_dto_1.UpdatePreferenceDto !== "undefined" && update_preference_dto_1.UpdatePreferenceDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "updatePreferences", null);
__decorate([
    (0, common_1.Post)('remove-duplicates'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "removeDuplicates", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, common_1.Controller)('notifications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof notifications_service_1.NotificationsService !== "undefined" && notifications_service_1.NotificationsService) === "function" ? _a : Object])
], NotificationsController);


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
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const notifications_controller_1 = __webpack_require__(/*! ./notifications.controller */ "./src/modules/notifications/notifications.controller.ts");
const notifications_service_1 = __webpack_require__(/*! ./notifications.service */ "./src/modules/notifications/notifications.service.ts");
const notification_schema_1 = __webpack_require__(/*! ./schemas/notification.schema */ "./src/modules/notifications/schemas/notification.schema.ts");
const notification_preference_schema_1 = __webpack_require__(/*! ./schemas/notification-preference.schema */ "./src/modules/notifications/schemas/notification-preference.schema.ts");
let NotificationsModule = class NotificationsModule {
};
exports.NotificationsModule = NotificationsModule;
exports.NotificationsModule = NotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: notification_schema_1.Notification.name, schema: notification_schema_1.NotificationSchema },
                { name: notification_preference_schema_1.NotificationPreference.name, schema: notification_preference_schema_1.NotificationPreferenceSchema },
            ]),
        ],
        controllers: [notifications_controller_1.NotificationsController],
        providers: [notifications_service_1.NotificationsService],
        exports: [notifications_service_1.NotificationsService],
    })
], NotificationsModule);


/***/ }),

/***/ "./src/modules/notifications/notifications.service.ts":
/*!************************************************************!*\
  !*** ./src/modules/notifications/notifications.service.ts ***!
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
exports.NotificationsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const notification_schema_1 = __webpack_require__(/*! ./schemas/notification.schema */ "./src/modules/notifications/schemas/notification.schema.ts");
const notification_preference_schema_1 = __webpack_require__(/*! ./schemas/notification-preference.schema */ "./src/modules/notifications/schemas/notification-preference.schema.ts");
let NotificationsService = class NotificationsService {
    constructor(notificationModel, preferenceModel) {
        this.notificationModel = notificationModel;
        this.preferenceModel = preferenceModel;
    }
    async create(createDto) {
        const shouldSend = await this.shouldSendNotification(createDto.userId, createDto.petId, createDto.type);
        if (!shouldSend)
            return null;
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const existingNotification = await this.notificationModel.findOne({
            userId: new mongoose_2.Types.ObjectId(createDto.userId),
            petId: createDto.petId ? new mongoose_2.Types.ObjectId(createDto.petId) : undefined,
            type: createDto.type,
            title: createDto.title,
            createdAt: { $gte: oneDayAgo },
        }).exec();
        if (existingNotification) {
            return existingNotification;
        }
        const notification = new this.notificationModel({
            ...createDto,
            userId: new mongoose_2.Types.ObjectId(createDto.userId),
            petId: createDto.petId ? new mongoose_2.Types.ObjectId(createDto.petId) : undefined,
        });
        return notification.save();
    }
    async findAllByUser(userId, petId) {
        const query = { userId: new mongoose_2.Types.ObjectId(userId), isActive: true };
        if (petId)
            query.petId = new mongoose_2.Types.ObjectId(petId);
        return this.notificationModel.find(query).sort({ createdAt: -1 }).limit(50).exec();
    }
    async markAsRead(notificationId, userId) {
        return this.notificationModel.findOneAndUpdate({ _id: new mongoose_2.Types.ObjectId(notificationId), userId: new mongoose_2.Types.ObjectId(userId) }, { isRead: true }, { new: true }).exec();
    }
    async markAllAsRead(userId) {
        await this.notificationModel.updateMany({ userId: new mongoose_2.Types.ObjectId(userId), isRead: false }, { isRead: true }).exec();
    }
    async getUnreadCount(userId) {
        return this.notificationModel.countDocuments({
            userId: new mongoose_2.Types.ObjectId(userId),
            isRead: false,
            isActive: true
        }).exec();
    }
    async getPreferences(userId) {
        let prefs = await this.preferenceModel.findOne({ userId: new mongoose_2.Types.ObjectId(userId) }).exec();
        if (!prefs) {
            prefs = await this.preferenceModel.create({ userId: new mongoose_2.Types.ObjectId(userId), petSettings: {} });
        }
        return prefs;
    }
    async updatePreferences(userId, updateDto) {
        try {
            const prefs = await this.getPreferences(userId);
            if (updateDto.globalEnabled !== undefined)
                prefs.globalEnabled = updateDto.globalEnabled;
            if (updateDto.emailNotifications !== undefined)
                prefs.emailNotifications = updateDto.emailNotifications;
            if (updateDto.pushNotifications !== undefined)
                prefs.pushNotifications = updateDto.pushNotifications;
            if (updateDto.reminderHoursBefore !== undefined)
                prefs.reminderHoursBefore = updateDto.reminderHoursBefore;
            if (updateDto.petId && updateDto.petSettings) {
                if (!prefs.petSettings)
                    prefs.petSettings = {};
                prefs.petSettings[updateDto.petId] = updateDto.petSettings;
                prefs.markModified('petSettings');
            }
            return await prefs.save();
        }
        catch (error) {
            console.error('Service update preferences error:', error);
            throw error;
        }
    }
    async shouldSendNotification(userId, petId, type) {
        const prefs = await this.getPreferences(userId);
        if (!prefs.globalEnabled)
            return false;
        if (petId) {
            const petSettings = prefs.petSettings[petId];
            if (!petSettings)
                return true;
            const typeMap = {
                'appointment': petSettings.appointments,
                'medication': petSettings.medications,
                'vaccination': petSettings.vaccinations,
                'checkup': petSettings.checkups,
                'health_alert': petSettings.healthAlerts,
                'weight': petSettings.weightChanges,
            };
            return typeMap[type] !== false;
        }
        return true;
    }
    async notifyAppointment(userId, petId, appointmentDate, vetName) {
        await this.create({
            userId,
            petId,
            title: 'Upcoming Appointment',
            message: `Appointment with ${vetName} on ${appointmentDate.toLocaleDateString()}`,
            type: 'appointment',
            actionUrl: `/appointments`,
        });
    }
    async notifyMedication(userId, petId, medicationName) {
        await this.create({
            userId,
            petId,
            title: 'Medication Reminder',
            message: `Time to give ${medicationName}`,
            type: 'medication',
            actionUrl: `/pets/${petId}/medications`,
        });
    }
    async notifyVaccination(userId, petId, vaccineName, dueDate) {
        await this.create({
            userId,
            petId,
            title: 'Vaccination Due',
            message: `${vaccineName} vaccination due on ${dueDate.toLocaleDateString()}`,
            type: 'vaccination',
            actionUrl: `/pets/${petId}/health-records`,
        });
    }
    async removeDuplicates(userId) {
        const notifications = await this.notificationModel.find({
            userId: new mongoose_2.Types.ObjectId(userId)
        }).sort({ createdAt: -1 }).exec();
        const seen = new Map();
        const duplicateIds = [];
        for (const notif of notifications) {
            const key = `${notif.userId}-${notif.petId}-${notif.type}-${notif.title}`;
            if (seen.has(key)) {
                duplicateIds.push(notif._id.toString());
            }
            else {
                seen.set(key, notif._id.toString());
            }
        }
        if (duplicateIds.length > 0) {
            await this.notificationModel.deleteMany({ _id: { $in: duplicateIds } }).exec();
        }
        return duplicateIds.length;
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(notification_schema_1.Notification.name)),
    __param(1, (0, mongoose_1.InjectModel)(notification_preference_schema_1.NotificationPreference.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object])
], NotificationsService);


/***/ }),

/***/ "./src/modules/notifications/schemas/notification-preference.schema.ts":
/*!*****************************************************************************!*\
  !*** ./src/modules/notifications/schemas/notification-preference.schema.ts ***!
  \*****************************************************************************/
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
exports.NotificationPreferenceSchema = exports.NotificationPreference = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
let NotificationPreference = class NotificationPreference {
};
exports.NotificationPreference = NotificationPreference;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true, unique: true }),
    __metadata("design:type", typeof (_a = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _a : Object)
], NotificationPreference.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], NotificationPreference.prototype, "globalEnabled", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.Mixed, default: {} }),
    __metadata("design:type", typeof (_b = typeof Record !== "undefined" && Record) === "function" ? _b : Object)
], NotificationPreference.prototype, "petSettings", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], NotificationPreference.prototype, "emailNotifications", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], NotificationPreference.prototype, "pushNotifications", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 24 }),
    __metadata("design:type", Number)
], NotificationPreference.prototype, "reminderHoursBefore", void 0);
exports.NotificationPreference = NotificationPreference = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], NotificationPreference);
exports.NotificationPreferenceSchema = mongoose_1.SchemaFactory.createForClass(NotificationPreference);


/***/ }),

/***/ "./src/modules/notifications/schemas/notification.schema.ts":
/*!******************************************************************!*\
  !*** ./src/modules/notifications/schemas/notification.schema.ts ***!
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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationSchema = exports.Notification = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
let Notification = class Notification {
};
exports.Notification = Notification;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", typeof (_a = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _a : Object)
], Notification.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Pet' }),
    __metadata("design:type", typeof (_b = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _b : Object)
], Notification.prototype, "petId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Notification.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Notification.prototype, "message", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['appointment', 'medication', 'vaccination', 'checkup', 'weight', 'health_alert', 'reminder', 'info'] }),
    __metadata("design:type", String)
], Notification.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Notification.prototype, "isRead", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Notification.prototype, "actionUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", typeof (_c = typeof Record !== "undefined" && Record) === "function" ? _c : Object)
], Notification.prototype, "metadata", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Notification.prototype, "isActive", void 0);
exports.Notification = Notification = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Notification);
exports.NotificationSchema = mongoose_1.SchemaFactory.createForClass(Notification);
exports.NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
exports.NotificationSchema.index({ userId: 1, petId: 1, type: 1 });


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
    (0, swagger_1.ApiPropertyOptional)({ description: 'Known allergies', type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreatePetDto.prototype, "allergies", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Past illnesses', type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreatePetDto.prototype, "pastIllnesses", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Previous surgeries', type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreatePetDto.prototype, "surgeries", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Dietary preferences' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePetDto.prototype, "dietaryPreferences", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Dietary restrictions', type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreatePetDto.prototype, "dietaryRestrictions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Behavioral notes and quirky details' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePetDto.prototype, "behavioralNotes", void 0);
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
        const userId = req.user.userId;
        const petData = {
            ...createPetDto,
            ownerId: userId,
            dateOfBirth: createPetDto.dateOfBirth ? new Date(createPetDto.dateOfBirth) : undefined
        };
        return this.petsService.create(petData);
    }
    async findMyPets(req, species) {
        const userId = req.user.userId;
        console.log('🐾 Finding pets for userId:', userId);
        return this.petsService.findByOwner(userId, species);
    }
    async findOne(id, req) {
        const userId = req.user.userId;
        return this.petsService.findById(id, userId);
    }
    async update(id, updatePetDto, req) {
        const userId = req.user.userId;
        const petData = { ...updatePetDto };
        if (updatePetDto.dateOfBirth) {
            petData.dateOfBirth = new Date(updatePetDto.dateOfBirth);
        }
        return this.petsService.update(id, userId, petData);
    }
    async updateHealthStatus(id, status, req) {
        const userId = req.user.userId;
        return this.petsService.updateHealthStatus(id, userId, status);
    }
    async remove(id, req) {
        const userId = req.user.userId;
        return this.petsService.delete(id, userId);
    }
};
exports.PetsController = PetsController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new pet profile',
        description: `
      Create a comprehensive pet profile with detailed information including:
      
      **Basic Information:**
      - Name, species, breed, age, gender
      - Physical characteristics (weight, color)
      - Date of birth
      
      **Medical Information:**
      - Known allergies
      - Past illnesses and surgeries
      - Medical notes
      
      **Dietary & Behavioral:**
      - Dietary preferences and restrictions
      - Behavioral notes and quirks
      
      **Emergency Information:**
      - Emergency contact details
      - Microchip ID
      
      **Tips:**
      - All fields except name, species, breed, age, and gender are optional
      - Use arrays for multiple allergies, illnesses, or restrictions
      - Include detailed behavioral notes for better pet care
    `
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Pet profile created successfully',
        schema: {
            example: {
                _id: '507f1f77bcf86cd799439012',
                name: 'Buddy',
                species: 'dog',
                breed: 'Golden Retriever',
                age: 3,
                gender: 'male',
                weight: 30.5,
                color: 'Golden',
                allergies: ['chicken', 'wheat'],
                dietaryPreferences: 'Grain-free diet',
                behavioralNotes: 'Very friendly, loves playing fetch',
                ownerId: '507f1f77bcf86cd799439010',
                healthStatus: 'healthy',
                isActive: true,
                createdAt: '2024-01-15T10:00:00.000Z'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Validation failed - Invalid pet data',
        schema: {
            example: {
                success: false,
                statusCode: 400,
                message: 'Validation failed for the provided data',
                details: [
                    {
                        property: 'age',
                        value: -1,
                        constraints: {
                            min: 'age must not be less than 0'
                        }
                    }
                ],
                suggestions: [
                    'Ensure age is between 0 and 30 years',
                    'Check all required fields are provided correctly'
                ]
            }
        }
    }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_pet_dto_1.CreatePetDto !== "undefined" && create_pet_dto_1.CreatePetDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], PetsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get all pets owned by the current user',
        description: `
      Retrieve all pets belonging to the authenticated user, with optional filtering by species.
      
      **Features:**
      - Returns only active pets (not deleted)
      - Sorted alphabetically by pet name
      - Optional species filtering
      - Includes complete pet profile information
      
      **Common Species:**
      - dog, cat, bird, rabbit, hamster, fish, reptile, other
    `
    }),
    (0, swagger_1.ApiQuery)({
        name: 'species',
        required: false,
        description: 'Filter pets by species (e.g., dog, cat, bird)',
        example: 'dog'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of user pets retrieved successfully',
        schema: {
            example: [
                {
                    _id: '507f1f77bcf86cd799439012',
                    name: 'Buddy',
                    species: 'dog',
                    breed: 'Golden Retriever',
                    age: 3,
                    healthStatus: 'healthy',
                    profileImage: 'https://example.com/buddy.jpg'
                },
                {
                    _id: '507f1f77bcf86cd799439013',
                    name: 'Whiskers',
                    species: 'cat',
                    breed: 'Persian',
                    age: 2,
                    healthStatus: 'healthy'
                }
            ]
        }
    }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('species')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PetsController.prototype, "findMyPets", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get detailed information for a specific pet',
        description: `
      Retrieve complete profile information for a specific pet by ID.
      
      **Security:**
      - Users can only access their own pets
      - Returns 403 Forbidden for pets owned by other users
      - Returns 404 Not Found for non-existent pets
      
      **Returned Information:**
      - Complete pet profile with all details
      - Medical history and health status
      - Dietary preferences and restrictions
      - Behavioral notes and emergency contacts
    `
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Unique identifier of the pet',
        example: '507f1f77bcf86cd799439012'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Pet details retrieved successfully',
        schema: {
            example: {
                _id: '507f1f77bcf86cd799439012',
                name: 'Buddy',
                species: 'dog',
                breed: 'Golden Retriever',
                age: 3,
                gender: 'male',
                weight: 30.5,
                color: 'Golden',
                microchipId: 'CHIP123456789',
                allergies: ['chicken', 'wheat'],
                pastIllnesses: ['kennel cough'],
                surgeries: ['neutering'],
                dietaryPreferences: 'Grain-free diet',
                dietaryRestrictions: ['chicken', 'dairy'],
                behavioralNotes: 'Very friendly, loves playing fetch, afraid of thunderstorms',
                emergencyContactName: 'John Doe',
                emergencyContactPhone: '+1234567890',
                healthStatus: 'healthy',
                ownerId: '507f1f77bcf86cd799439010',
                createdAt: '2024-01-15T10:00:00.000Z',
                updatedAt: '2024-01-15T10:00:00.000Z'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Access denied - Pet belongs to another user',
        schema: {
            example: {
                success: false,
                statusCode: 403,
                message: 'Access denied',
                suggestions: [
                    'You do not have permission to access this resource',
                    'Ensure you are accessing your own pet data'
                ]
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Pet not found',
        schema: {
            example: {
                success: false,
                statusCode: 404,
                message: "Pet with ID '507f1f77bcf86cd799439012' does not exist",
                suggestions: [
                    'Check if the pet ID is correct',
                    'Verify the pet exists and you have access to it'
                ]
            }
        }
    }),
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
    (0, swagger_1.ApiTags)('Pets'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
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
        const filter = { ownerId: new mongoose_2.Types.ObjectId(ownerId), isActive: true };
        if (species)
            filter.species = species;
        return this.petModel.find(filter).sort({ name: 1 }).exec();
    }
    async findById(id, ownerId) {
        const pet = await this.petModel.findById(id).exec();
        if (!pet) {
            throw new common_1.NotFoundException(`Pet with ID '${id}' does not exist`);
        }
        if (ownerId && !pet.ownerId.equals(new mongoose_2.Types.ObjectId(ownerId))) {
            throw new common_1.ForbiddenException(`Access denied`);
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
            throw new Error(`Invalid health status '${status}'. Valid options are: ${validStatuses.join(', ')}`);
        }
        return this.petModel.findByIdAndUpdate(id, { healthStatus: status }, { new: true }).exec();
    }
    async findByHealthStatus(ownerId, status) {
        return this.petModel.find({ ownerId, healthStatus: status, isActive: true }).exec();
    }
    async findByName(ownerId, name) {
        return this.petModel.findOne({
            ownerId,
            name: { $regex: new RegExp(name, 'i') },
            isActive: true
        }).exec();
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
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Pet.prototype, "allergies", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Pet.prototype, "pastIllnesses", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Pet.prototype, "surgeries", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Pet.prototype, "dietaryPreferences", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Pet.prototype, "dietaryRestrictions", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Pet.prototype, "behavioralNotes", void 0);
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

/***/ "./src/modules/seed/events.ts":
/*!************************************!*\
  !*** ./src/modules/seed/events.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sampleEvents = void 0;
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const userId = new mongoose_1.Types.ObjectId('507f1f77bcf86cd799439011');
const petIds = [
    new mongoose_1.Types.ObjectId('690582532c8149e4fd0d51bc'),
    new mongoose_1.Types.ObjectId('690582532c8149e4fd0d51bd'),
];
exports.sampleEvents = [
    {
        _id: new mongoose_1.Types.ObjectId(),
        userId,
        petId: petIds[0],
        title: 'Annual Checkup',
        description: 'Yearly health examination and vaccinations',
        eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        eventTime: '10:00 AM',
        location: 'Happy Paws Veterinary Clinic',
        category: 'checkup',
        status: 'scheduled',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: new mongoose_1.Types.ObjectId(),
        userId,
        petId: petIds[1],
        title: 'Grooming Appointment',
        description: 'Full grooming service including bath and nail trim',
        eventDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        eventTime: '2:30 PM',
        location: 'Pampered Pets Spa',
        category: 'grooming',
        status: 'scheduled',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: new mongoose_1.Types.ObjectId(),
        userId,
        petId: petIds[0],
        title: 'Vaccination Booster',
        description: 'Rabies and DHPP booster shots',
        eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        eventTime: '11:30 AM',
        location: 'City Animal Hospital',
        category: 'vaccination',
        status: 'scheduled',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: new mongoose_1.Types.ObjectId(),
        userId,
        petId: petIds[0],
        title: 'Dental Cleaning',
        description: 'Professional teeth cleaning',
        eventDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        eventTime: '9:00 AM',
        location: 'Pet Dental Care Center',
        category: 'checkup',
        status: 'completed',
        isActive: true,
        createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
];


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
        petId: pets_1.lunaId,
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
        isReminder: true,
        isCompleted: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: new mongoose_1.Types.ObjectId(),
        petId: pets_1.lunaId,
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
        petId: pets_1.lunaId,
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
        petId: pets_1.shadowId,
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
        isReminder: true,
        isCompleted: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: new mongoose_1.Types.ObjectId(),
        petId: pets_1.shadowId,
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
        petId: pets_1.buddyId,
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
        petId: pets_1.buddyId,
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
        isReminder: true,
        isCompleted: false,
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
exports.sampleReminders = exports.sampleEvents = exports.sampleNotifications = exports.sampleMedications = exports.sampleHealthRecords = exports.samplePets = exports.sampleUsers = void 0;
const users_1 = __webpack_require__(/*! ./users */ "./src/modules/seed/users.ts");
Object.defineProperty(exports, "sampleUsers", ({ enumerable: true, get: function () { return users_1.sampleUsers; } }));
const pets_1 = __webpack_require__(/*! ./pets */ "./src/modules/seed/pets.ts");
Object.defineProperty(exports, "samplePets", ({ enumerable: true, get: function () { return pets_1.samplePets; } }));
const healthRecords_1 = __webpack_require__(/*! ./healthRecords */ "./src/modules/seed/healthRecords.ts");
Object.defineProperty(exports, "sampleHealthRecords", ({ enumerable: true, get: function () { return healthRecords_1.sampleHealthRecords; } }));
const medications_1 = __webpack_require__(/*! ./medications */ "./src/modules/seed/medications.ts");
Object.defineProperty(exports, "sampleMedications", ({ enumerable: true, get: function () { return medications_1.sampleMedications; } }));
const notifications_1 = __webpack_require__(/*! ./notifications */ "./src/modules/seed/notifications.ts");
Object.defineProperty(exports, "sampleNotifications", ({ enumerable: true, get: function () { return notifications_1.sampleNotifications; } }));
const events_1 = __webpack_require__(/*! ./events */ "./src/modules/seed/events.ts");
Object.defineProperty(exports, "sampleEvents", ({ enumerable: true, get: function () { return events_1.sampleEvents; } }));
const reminders_1 = __webpack_require__(/*! ./reminders */ "./src/modules/seed/reminders.ts");
Object.defineProperty(exports, "sampleReminders", ({ enumerable: true, get: function () { return reminders_1.sampleReminders; } }));


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

/***/ "./src/modules/seed/notifications.ts":
/*!*******************************************!*\
  !*** ./src/modules/seed/notifications.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sampleNotifications = void 0;
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const users_1 = __webpack_require__(/*! ./users */ "./src/modules/seed/users.ts");
const sampleNotifications = [
    {
        _id: new mongoose_1.Types.ObjectId(),
        userId: users_1.akdavidUserId,
        title: 'Vaccination Due',
        message: 'Max is due for his annual rabies vaccination next week.',
        type: 'vaccination',
        isRead: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: new mongoose_1.Types.ObjectId(),
        userId: users_1.akdavidUserId,
        title: 'Appointment Reminder',
        message: 'You have a vet appointment tomorrow at 2:00 PM.',
        type: 'appointment',
        isRead: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: new mongoose_1.Types.ObjectId(),
        userId: users_1.akdavidUserId,
        title: 'Medication Reminder',
        message: 'Time to give Bella her heartworm medication.',
        type: 'medication',
        isRead: true,
        isActive: true,
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 86400000)
    },
    {
        _id: new mongoose_1.Types.ObjectId(),
        userId: users_1.akdavidUserId,
        title: 'Health Checkup',
        message: 'Luna is due for her 6-month health checkup.',
        type: 'checkup',
        isRead: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: new mongoose_1.Types.ObjectId(),
        userId: users_1.akdavidUserId,
        title: 'Weight Alert',
        message: 'Max has gained 2 lbs since last checkup. Consider adjusting diet.',
        type: 'weight',
        isRead: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    }
];
exports.sampleNotifications = sampleNotifications;


/***/ }),

/***/ "./src/modules/seed/pets.ts":
/*!**********************************!*\
  !*** ./src/modules/seed/pets.ts ***!
  \**********************************/
/***/ ((module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.maxId = exports.whiskersId = exports.buddyId = exports.shadowId = exports.lunaId = exports.samplePets = void 0;
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const users_1 = __webpack_require__(/*! ./users */ "./src/modules/seed/users.ts");
const lunaId = new mongoose_1.Types.ObjectId('690e8da85db702e57de01ff9');
exports.lunaId = lunaId;
const shadowId = new mongoose_1.Types.ObjectId('690e8da85db702e57de01ffa');
exports.shadowId = shadowId;
const buddyId = new mongoose_1.Types.ObjectId('690e8da85db702e57de01ffb');
exports.buddyId = buddyId;
const whiskersId = new mongoose_1.Types.ObjectId('690e8da85db702e57de01ffc');
exports.whiskersId = whiskersId;
const maxId = new mongoose_1.Types.ObjectId('690e8da85db702e57de01ffd');
exports.maxId = maxId;
exports.samplePets = [
    {
        _id: lunaId,
        name: 'Luna',
        species: 'dog',
        breed: 'Labrador Retriever',
        age: 2,
        gender: 'female',
        weight: 25.0,
        color: 'Black',
        ownerId: users_1.sampleUsers[0]._id,
        dateOfBirth: new Date('2022-05-10'),
        medicalNotes: 'Very active and healthy. Loves swimming.',
        emergencyContactName: 'David Ak',
        emergencyContactPhone: '+1234567890',
        healthStatus: 'healthy',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: shadowId,
        name: 'Shadow',
        species: 'cat',
        breed: 'Maine Coon',
        age: 4,
        gender: 'male',
        weight: 6.5,
        color: 'Gray',
        ownerId: users_1.sampleUsers[0]._id,
        dateOfBirth: new Date('2020-08-15'),
        medicalNotes: 'Indoor/outdoor cat. Regular flea prevention.',
        emergencyContactName: 'David Ak',
        emergencyContactPhone: '+1234567890',
        healthStatus: 'healthy',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: buddyId,
        name: 'Buddy',
        species: 'dog',
        breed: 'Golden Retriever',
        age: 3,
        gender: 'male',
        weight: 30.5,
        color: 'Golden',
        ownerId: users_1.sampleUsers[1]._id,
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
        _id: whiskersId,
        name: 'Whiskers',
        species: 'cat',
        breed: 'Persian',
        age: 5,
        gender: 'female',
        weight: 4.2,
        color: 'White',
        ownerId: users_1.sampleUsers[2]._id,
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
        _id: maxId,
        name: 'Max',
        species: 'dog',
        breed: 'German Shepherd',
        age: 7,
        gender: 'male',
        weight: 35.0,
        color: 'Black and Tan',
        ownerId: users_1.sampleUsers[1]._id,
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
module.exports = { samplePets: exports.samplePets, lunaId, shadowId, buddyId, whiskersId, maxId };


/***/ }),

/***/ "./src/modules/seed/reminders.ts":
/*!***************************************!*\
  !*** ./src/modules/seed/reminders.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sampleReminders = void 0;
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const userId = new mongoose_1.Types.ObjectId('507f1f77bcf86cd799439011');
const petIds = [
    new mongoose_1.Types.ObjectId('690582532c8149e4fd0d51bc'),
    new mongoose_1.Types.ObjectId('690582532c8149e4fd0d51bd'),
];
exports.sampleReminders = [
    {
        _id: new mongoose_1.Types.ObjectId(),
        petId: petIds[0],
        type: 'vaccination',
        title: 'Rabies Vaccination',
        description: 'Annual rabies vaccination is due',
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        nextDueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        veterinarian: 'Dr. Sarah Johnson',
        clinic: 'Happy Paws Veterinary Clinic',
        isReminder: true,
        isActive: true,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    },
    {
        _id: new mongoose_1.Types.ObjectId(),
        petId: petIds[1],
        type: 'checkup',
        title: 'Annual Health Checkup',
        description: 'Yearly comprehensive health examination',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        nextDueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        veterinarian: 'Dr. Michael Chen',
        clinic: 'City Animal Hospital',
        isReminder: true,
        isActive: true,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
    {
        _id: new mongoose_1.Types.ObjectId(),
        petId: petIds[0],
        type: 'medication',
        title: 'Heartworm Prevention',
        description: 'Monthly heartworm preventive medication',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        nextDueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        isReminder: true,
        isActive: true,
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    },
    {
        _id: new mongoose_1.Types.ObjectId(),
        petId: petIds[1],
        type: 'grooming',
        title: 'Grooming Session',
        description: 'Regular grooming and nail trimming',
        date: new Date(),
        nextDueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        clinic: 'Pampered Pets Spa',
        isReminder: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: new mongoose_1.Types.ObjectId(),
        petId: petIds[0],
        type: 'vaccination',
        title: 'DHPP Booster',
        description: 'Distemper, Hepatitis, Parvovirus, Parainfluenza booster',
        date: new Date(),
        nextDueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        veterinarian: 'Dr. Sarah Johnson',
        clinic: 'Happy Paws Veterinary Clinic',
        isReminder: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: new mongoose_1.Types.ObjectId(),
        petId: petIds[1],
        type: 'checkup',
        title: 'Dental Checkup',
        description: 'Routine dental examination',
        date: new Date(),
        nextDueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        veterinarian: 'Dr. Emily Rodriguez',
        clinic: 'Pet Dental Care Center',
        isReminder: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];


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
            console.log('🗑️ Clearing existing data...');
            await this.userModel.deleteMany({});
            await db.collection('pets').deleteMany({});
            await db.collection('healthrecords').deleteMany({});
            await db.collection('medications').deleteMany({});
            await db.collection('notifications').deleteMany({});
            await db.collection('notificationpreferences').deleteMany({});
            await db.collection('events').deleteMany({});
            console.log('✅ Existing data cleared');
            console.log('👥 Creating users...');
            await this.userModel.insertMany(index_1.sampleUsers);
            console.log('🐾 Creating pets...');
            await db.collection('pets').insertMany(index_1.samplePets);
            console.log('🏥 Creating health records...');
            const luna = await db.collection('pets').findOne({ name: 'Luna' });
            const shadow = await db.collection('pets').findOne({ name: 'Shadow' });
            const buddy = await db.collection('pets').findOne({ name: 'Buddy' });
            console.log('Luna ID from DB:', luna?._id.toString());
            console.log('Shadow ID from DB:', shadow?._id.toString());
            console.log('Sample record petId:', index_1.sampleHealthRecords[0]?.petId.toString());
            const healthRecordsWithCorrectPets = index_1.sampleHealthRecords.map(record => {
                const recordPetIdStr = record.petId.toString();
                if (luna && recordPetIdStr === luna._id.toString())
                    return { ...record, petId: luna._id };
                if (shadow && recordPetIdStr === shadow._id.toString())
                    return { ...record, petId: shadow._id };
                if (buddy && recordPetIdStr === buddy._id.toString())
                    return { ...record, petId: buddy._id };
                return record;
            });
            await db.collection('healthrecords').insertMany(healthRecordsWithCorrectPets);
            console.log(`✅ Inserted ${healthRecordsWithCorrectPets.length} health records`);
            console.log('💊 Creating medications...');
            await db.collection('medications').insertMany(index_1.sampleMedications);
            console.log('🔔 Creating notifications...');
            await db.collection('notifications').insertMany(index_1.sampleNotifications);
            console.log('📅 Creating events...');
            await db.collection('events').insertMany(index_1.sampleEvents);
            console.log('⏰ Creating additional reminders...');
            if (luna && shadow) {
                const remindersWithActualPets = index_1.sampleReminders.map((reminder, index) => ({
                    ...reminder,
                    petId: index % 2 === 0 ? luna._id : shadow._id,
                }));
                await db.collection('healthrecords').insertMany(remindersWithActualPets);
                console.log(`✅ Assigned ${remindersWithActualPets.filter(r => r.petId.equals(luna._id)).length} reminders to Luna`);
                console.log(`✅ Assigned ${remindersWithActualPets.filter(r => r.petId.equals(shadow._id)).length} reminders to Shadow`);
            }
            return {
                message: 'Database seeded successfully!',
                summary: {
                    users: index_1.sampleUsers.length,
                    pets: index_1.samplePets.length,
                    healthRecords: index_1.sampleHealthRecords.length + index_1.sampleReminders.length,
                    medications: index_1.sampleMedications.length,
                    notifications: index_1.sampleNotifications.length,
                    events: index_1.sampleEvents.length,
                    reminders: index_1.sampleReminders.length,
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
exports.akdavidUserId = exports.sampleUsers = void 0;
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const bcrypt = __webpack_require__(/*! bcrypt */ "bcrypt");
const akdavidUserId = new mongoose_1.Types.ObjectId('507f1f77bcf86cd799439011');
exports.akdavidUserId = akdavidUserId;
const sampleUsers = [
    {
        _id: akdavidUserId,
        email: 'akdavid4real@gmail.com',
        password: bcrypt.hashSync('Shadowfight@2', 12),
        firstName: 'David',
        lastName: 'Ak',
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
    },
    {
        _id: new mongoose_1.Types.ObjectId(),
        email: 'dr.sarah@vetclinic.com',
        password: bcrypt.hashSync('VetPass123', 12),
        firstName: 'Dr. Sarah',
        lastName: 'Johnson',
        phone: '+1555123456',
        address: '789 Vet Clinic Rd, City, State 11111',
        isActive: true,
        isEmailVerified: true,
        role: 'vet',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: new mongoose_1.Types.ObjectId(),
        email: 'dr.mike@petcare.com',
        password: bcrypt.hashSync('VetPass123', 12),
        firstName: 'Dr. Michael',
        lastName: 'Chen',
        phone: '+1555789012',
        address: '321 Pet Care Blvd, City, State 22222',
        isActive: true,
        isEmailVerified: true,
        role: 'vet',
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

/***/ "./src/modules/symptom-checker/schemas/symptom-check.schema.ts":
/*!*********************************************************************!*\
  !*** ./src/modules/symptom-checker/schemas/symptom-check.schema.ts ***!
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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SymptomCheckSchema = exports.SymptomCheck = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
let SymptomCheck = class SymptomCheck extends mongoose_2.Document {
};
exports.SymptomCheck = SymptomCheck;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", typeof (_a = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _a : Object)
], SymptomCheck.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Pet', required: true }),
    __metadata("design:type", typeof (_b = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _b : Object)
], SymptomCheck.prototype, "petId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SymptomCheck.prototype, "petName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], required: true }),
    __metadata("design:type", Array)
], SymptomCheck.prototype, "symptoms", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SymptomCheck.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SymptomCheck.prototype, "severity", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SymptomCheck.prototype, "additionalInfo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SymptomCheck.prototype, "urgencyLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], required: true }),
    __metadata("design:type", Array)
], SymptomCheck.prototype, "possibleConditions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], required: true }),
    __metadata("design:type", Array)
], SymptomCheck.prototype, "recommendations", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Boolean)
], SymptomCheck.prototype, "vetRequired", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], SymptomCheck.prototype, "warningSignsToWatch", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SymptomCheck.prototype, "personalizedMessage", void 0);
exports.SymptomCheck = SymptomCheck = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], SymptomCheck);
exports.SymptomCheckSchema = mongoose_1.SchemaFactory.createForClass(SymptomCheck);


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
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class ChatMessageDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ChatMessageDto.prototype, "message", void 0);
let SymptomCheckerController = class SymptomCheckerController {
    constructor(symptomCheckerService) {
        this.symptomCheckerService = symptomCheckerService;
    }
    async checkSymptoms(req, symptomCheckDto) {
        return this.symptomCheckerService.checkSymptoms(req.user.userId, symptomCheckDto);
    }
    async chatWithAI(req, chatDto) {
        const response = await this.symptomCheckerService.chatWithAI(req.user.userId, chatDto.message);
        return { response };
    }
    async getHistory(req) {
        return this.symptomCheckerService.getHistory(req.user.userId);
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
__decorate([
    (0, common_1.Post)('chat'),
    (0, swagger_1.ApiOperation)({ summary: 'Chat with Dr. Woofson AI veterinarian' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ChatMessageDto]),
    __metadata("design:returntype", Promise)
], SymptomCheckerController.prototype, "chatWithAI", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get symptom check history' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SymptomCheckerController.prototype, "getHistory", null);
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
const user_schema_1 = __webpack_require__(/*! ../auth/schemas/user.schema */ "./src/modules/auth/schemas/user.schema.ts");
const symptom_check_schema_1 = __webpack_require__(/*! ./schemas/symptom-check.schema */ "./src/modules/symptom-checker/schemas/symptom-check.schema.ts");
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
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: symptom_check_schema_1.SymptomCheck.name, schema: symptom_check_schema_1.SymptomCheckSchema },
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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SymptomCheckerService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const pet_schema_1 = __webpack_require__(/*! ../pets/schemas/pet.schema */ "./src/modules/pets/schemas/pet.schema.ts");
const health_record_schema_1 = __webpack_require__(/*! ../health-records/schemas/health-record.schema */ "./src/modules/health-records/schemas/health-record.schema.ts");
const medication_schema_1 = __webpack_require__(/*! ../medications/schemas/medication.schema */ "./src/modules/medications/schemas/medication.schema.ts");
const user_schema_1 = __webpack_require__(/*! ../auth/schemas/user.schema */ "./src/modules/auth/schemas/user.schema.ts");
const symptom_check_schema_1 = __webpack_require__(/*! ./schemas/symptom-check.schema */ "./src/modules/symptom-checker/schemas/symptom-check.schema.ts");
let SymptomCheckerService = class SymptomCheckerService {
    constructor(petModel, healthRecordModel, medicationModel, userModel, symptomCheckModel) {
        this.petModel = petModel;
        this.healthRecordModel = healthRecordModel;
        this.medicationModel = medicationModel;
        this.userModel = userModel;
        this.symptomCheckModel = symptomCheckModel;
    }
    async extractPetContext(userId, message) {
        const [user, userPets] = await Promise.all([
            this.userModel.findById(userId).exec(),
            this.petModel.find({ ownerId: userId, isActive: true }).exec()
        ]);
        if (userPets.length === 0)
            return '';
        const mentionedPets = this.findMentionedPets(userPets, message);
        const petsToShow = mentionedPets.length > 0 ? mentionedPets : userPets;
        const contexts = await Promise.all(petsToShow.map(pet => this.getPetDetailedContext(pet)));
        const userInfo = user ? `**${user.firstName}'s Pet Information:**\n` : '';
        return userInfo + contexts.filter(Boolean).join('\n\n');
    }
    findMentionedPets(userPets, message) {
        const messageLower = message.toLowerCase();
        const words = messageLower.split(/\s+/);
        return userPets.filter(pet => {
            const petNameLower = pet.name.toLowerCase();
            return words.some(word => word === petNameLower ||
                word.includes(petNameLower) ||
                petNameLower.includes(word)) || messageLower.includes(petNameLower);
        });
    }
    async getPetDetailedContext(pet) {
        const [healthRecords, medications] = await Promise.all([
            this.healthRecordModel
                .find({ petId: pet._id, isActive: true })
                .sort({ date: -1 })
                .limit(5)
                .exec(),
            this.medicationModel
                .find({ petId: pet._id, status: 'active' })
                .exec()
        ]);
        return `**${pet.name}'s Complete Profile:**
- Species: ${pet.species} | Breed: ${pet.breed || 'Mixed'} | Age: ${pet.age} years
- Gender: ${pet.gender} | Weight: ${pet.weight || 'Not recorded'} kg
- Health Status: ${pet.healthStatus || 'Unknown'}
- Microchip: ${pet.microchipId || 'Not microchipped'}
- Color: ${pet.color || 'Not specified'}

**Recent Medical History:**
${healthRecords.length > 0 ?
            healthRecords.map(record => `• ${record.date.toDateString()}: ${record.type} - ${record.title || record.description}${record.notes ? ` (Notes: ${record.notes})` : ''}`).join('\n') :
            '• No recent medical records on file'}

**Current Medications:**
${medications.length > 0 ?
            medications.map(med => `• ${med.name}: ${med.dosage} - ${med.frequency}${med.instructions ? ` (${med.instructions})` : ''}`).join('\n') :
            '• No current medications'}

**Emergency Contact:** Owner should be contacted for any urgent concerns.`;
    }
    async checkSymptoms(userId, symptomCheckDto) {
        const [user, pet] = await Promise.all([
            this.userModel.findById(userId).exec(),
            this.petModel.findById(symptomCheckDto.petId).exec()
        ]);
        if (!pet) {
            throw new common_1.NotFoundException(`Pet with ID '${symptomCheckDto.petId}' does not exist`);
        }
        if (pet.ownerId.toString() !== userId) {
            throw new common_1.NotFoundException(`You don't have permission to access pet '${pet.name}' (ID: ${symptomCheckDto.petId}). This pet belongs to another user.`);
        }
        const [healthRecords, medications] = await Promise.all([
            this.healthRecordModel
                .find({ petId: symptomCheckDto.petId, isActive: true })
                .sort({ date: -1 })
                .limit(10)
                .exec(),
            this.medicationModel
                .find({ petId: symptomCheckDto.petId, status: 'active' })
                .exec()
        ]);
        const petContext = this.buildPetContext(user, pet, healthRecords, medications);
        const aiResponse = await this.callMistralAI(petContext, symptomCheckDto);
        await this.symptomCheckModel.create({
            userId,
            petId: symptomCheckDto.petId,
            petName: pet.name,
            symptoms: symptomCheckDto.symptoms,
            duration: symptomCheckDto.duration,
            severity: symptomCheckDto.severity.toString(),
            additionalInfo: symptomCheckDto.additionalInfo,
            urgencyLevel: aiResponse.urgencyLevel,
            possibleConditions: aiResponse.possibleConditions,
            recommendations: aiResponse.recommendations,
            vetRequired: aiResponse.vetRequired,
            warningSignsToWatch: aiResponse.warningSignsToWatch,
            personalizedMessage: aiResponse.personalizedMessage,
        });
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
    buildPetContext(user, pet, healthRecords, medications) {
        const context = `
Owner Information:
- Name: ${user?.firstName} ${user?.lastName}
- Email: ${user?.email}

Pet Information:
- Name: ${pet.name}
- Species: ${pet.species}
- Breed: ${pet.breed}
- Age: ${pet.age} years
- Gender: ${pet.gender}
- Weight: ${pet.weight || 'Not specified'} kg
- Current Health Status: ${pet.healthStatus}

Recent Medical History (Last 10 records):
${healthRecords.length > 0 ? healthRecords.map(record => `- ${record.date.toDateString()}: ${record.type} - ${record.description}${record.notes ? ` (${record.notes})` : ''}`).join('\n') : 'No recent medical records'}

Current Medications:
${medications.length > 0 ?
            medications.map(med => `- ${med.name}: ${med.dosage} ${med.frequency} (${med.instructions})`).join('\n') :
            'No current medications'}`;
        return context;
    }
    async callMistralAI(petContext, symptomCheckDto) {
        const prompt = `You are Dr. Woofson, a friendly and expert veterinary AI assistant. You have access to the owner's information and should address them by name when appropriate. Analyze these symptoms for a detailed professional assessment.

${petContext}

Current Symptoms:
- Symptoms: ${symptomCheckDto.symptoms.join(', ')}
- Duration: ${symptomCheckDto.duration}
- Severity: ${symptomCheckDto.severity}/4
- Additional Info: ${symptomCheckDto.additionalInfo || 'None'}

Provide a comprehensive veterinary analysis with:
1. Urgency level: Emergency, Urgent, Monitor, or Normal
2. 3-5 most likely conditions with brief explanations
3. Specific immediate care recommendations
4. Whether veterinary consultation is needed (true/false)
5. Specific warning signs to monitor
6. A personalized message addressing the owner by name

Respond ONLY with valid JSON in this exact format:
{
  "urgencyLevel": "Monitor",
  "possibleConditions": ["Condition 1: explanation", "Condition 2: explanation"],
  "recommendations": ["Specific action 1", "Specific action 2"],
  "vetRequired": true,
  "warningSignsToWatch": ["Sign 1", "Sign 2"],
  "personalizedMessage": "Hello [Owner Name], based on [Pet Name]'s symptoms..."
}`;
        try {
            if (!process.env.MISTRAL_API_KEY) {
                console.log('⚠️ MISTRAL_API_KEY not configured, using fallback response');
                throw new Error('Mistral API key not configured');
            }
            console.log('🤖 Calling Mistral AI for symptom analysis...');
            const response = await fetch(`${process.env.MISTRAL_API_BASE || 'https://api.mistral.ai'}/v1/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'mistral-large-latest',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.2,
                    max_tokens: 1500
                })
            });
            if (!response.ok) {
                console.error('❌ Mistral API error:', response.status, response.statusText);
                throw new Error(`Mistral API error: ${response.status}`);
            }
            const data = await response.json();
            console.log('✅ Mistral AI response received');
            const aiContent = data.choices[0].message.content;
            try {
                const parsed = JSON.parse(aiContent);
                console.log('✅ JSON parsed successfully');
                return parsed;
            }
            catch (parseError) {
                console.error('❌ JSON parse error:', parseError);
                console.log('Raw AI content:', aiContent);
                return {
                    urgencyLevel: 'Monitor',
                    possibleConditions: [
                        'Multiple symptoms present: ' + symptomCheckDto.symptoms.join(', '),
                        'Possible allergic reaction or environmental irritant',
                        'Stress-related symptoms from environmental changes'
                    ],
                    recommendations: [
                        'Monitor symptoms closely for 24-48 hours',
                        'Ensure fresh water is always available',
                        'Remove potential allergens from environment',
                        'Keep a symptom diary with times and triggers'
                    ],
                    vetRequired: true,
                    warningSignsToWatch: [
                        'Worsening of any current symptoms',
                        'Loss of appetite or refusal to eat',
                        'Lethargy or unusual behavior changes',
                        'Difficulty breathing or excessive panting'
                    ]
                };
            }
        }
        catch (error) {
            console.log('⚠️ Mistral AI unavailable, using intelligent fallback response');
            console.error('Error details:', error.message);
            const hasRespiratorySymptoms = symptomCheckDto.symptoms.some(s => s.toLowerCase().includes('wheezing') || s.toLowerCase().includes('cough') || s.toLowerCase().includes('breathing'));
            const hasDigestiveSymptoms = symptomCheckDto.symptoms.some(s => s.toLowerCase().includes('vomit') || s.toLowerCase().includes('diarrhea'));
            const hasSkinSymptoms = symptomCheckDto.symptoms.some(s => s.toLowerCase().includes('itch') || s.toLowerCase().includes('scratch') || s.toLowerCase().includes('rash'));
            return {
                urgencyLevel: symptomCheckDto.severity >= 3 ? 'Urgent' : 'Monitor',
                possibleConditions: [
                    hasRespiratorySymptoms ? 'Respiratory irritation or allergic reaction' : 'Multiple symptom presentation',
                    hasDigestiveSymptoms ? 'Gastrointestinal upset or dietary sensitivity' : 'Possible environmental stressor',
                    hasSkinSymptoms ? 'Allergic dermatitis or contact irritation' : 'Stress-related behavioral changes',
                    'Multi-system involvement requiring professional evaluation'
                ],
                recommendations: [
                    'Schedule veterinary examination within 24-48 hours',
                    'Monitor eating, drinking, and elimination habits',
                    'Remove potential allergens from environment',
                    'Keep detailed symptom log with timestamps'
                ],
                vetRequired: true,
                warningSignsToWatch: [
                    'Worsening symptoms or new symptoms appearing',
                    'Loss of appetite lasting more than 12 hours',
                    'Difficulty breathing or excessive panting',
                    'Lethargy or unresponsiveness'
                ]
            };
        }
    }
    async getHistory(userId) {
        return this.symptomCheckModel
            .find({ userId })
            .sort({ createdAt: -1 })
            .limit(3)
            .exec();
    }
    async chatWithAI(userId, message) {
        try {
            const petContext = await this.extractPetContext(userId, message);
            const systemPrompt = `You are Dr. Woofson, a friendly and knowledgeable AI veterinarian assistant. You help pet owners with:
- General pet health questions
- Symptom assessment and advice
- Preventive care guidance
- Emergency situation recognition

Always be helpful, empathetic, and professional. If symptoms seem serious, recommend veterinary consultation.

${petContext ? `\n\nUser's Pet Information:\n${petContext}` : ''}`;
            const response = await fetch(`${process.env.MISTRAL_API_BASE || 'https://api.mistral.ai'}/v1/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'mistral-large-latest',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: message }
                    ],
                    temperature: 0.7,
                    max_tokens: 500
                })
            });
            if (!response.ok) {
                throw new Error(`Mistral API error: ${response.status}`);
            }
            const data = await response.json();
            return data.choices[0].message.content;
        }
        catch (error) {
            console.error('AI chat error:', error);
            return "Hello! I'm Dr. Woofson. I'm here to help with your pet's health questions. What would you like to know about your furry friend?";
        }
    }
};
exports.SymptomCheckerService = SymptomCheckerService;
exports.SymptomCheckerService = SymptomCheckerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(pet_schema_1.Pet.name)),
    __param(1, (0, mongoose_1.InjectModel)(health_record_schema_1.HealthRecord.name)),
    __param(2, (0, mongoose_1.InjectModel)(medication_schema_1.Medication.name)),
    __param(3, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(4, (0, mongoose_1.InjectModel)(symptom_check_schema_1.SymptomCheck.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object, typeof (_d = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _d : Object, typeof (_e = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _e : Object])
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
        const userId = req.user.userId || req.user._id || req.user.id;
        return this.userService.findById(userId);
    }
    async updateProfile(req, updateData) {
        const userId = req.user.userId || req.user._id || req.user.id;
        return this.userService.updateProfile(userId, updateData);
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

/***/ "@nestjs/websockets":
/*!*************************************!*\
  !*** external "@nestjs/websockets" ***!
  \*************************************/
/***/ ((module) => {

module.exports = require("@nestjs/websockets");

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

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("socket.io");

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
const global_exception_filter_1 = __webpack_require__(/*! ./common/filters/global-exception.filter */ "./src/common/filters/global-exception.filter.ts");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : ['log', 'error', 'warn', 'debug', 'verbose']
    });
    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
        exceptionFactory: (errors) => {
            const result = errors.map((error) => ({
                property: error.property,
                value: error.value,
                constraints: error.constraints,
                suggestions: [
                    `Check the '${error.property}' field format and requirements`,
                    'Refer to the API documentation for correct data types',
                ],
            }));
            return {
                message: 'Validation failed for the provided data',
                statusCode: 400,
                details: result,
                suggestions: [
                    'Review all field requirements in the API documentation',
                    'Ensure all required fields are provided with correct data types',
                ],
            };
        },
    }));
    app.enableCors({
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    });
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'));
    const shouldEnableSwagger = process.env.NODE_ENV !== 'production' || process.env.ENABLE_SWAGGER === 'true';
    if (shouldEnableSwagger) {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('🐾 PawPromise API')
            .setDescription(`
        ## Comprehensive Pet Management Platform
        
        **PawPromise** is a modern pet management platform that helps pet owners:
        - Track their pets' health and wellness
        - Schedule appointments and manage medical records
        - Log daily activities and diet
        - Manage medications and vaccinations
        - Connect with veterinarians
        
        ### 🔐 Authentication
        Most endpoints require JWT authentication. Use the **Authorize** button to set your Bearer token.
        
        ### 📱 Features
        - **Pet Management**: Complete pet profiles with detailed information
        - **Health Tracking**: Medical records, medications, vaccinations
        - **Activity Logging**: Daily walks, feeding, exercise tracking
        - **Appointment System**: Vet appointment scheduling
        - **Insurance Management**: Pet insurance policies and claims
        - **Reminders**: Automated health and medication reminders
        
        ### 🚨 Error Handling
        All endpoints return detailed error messages with:
        - Clear error descriptions
        - Validation details
        - Suggested solutions
        - HTTP status codes
      `)
            .setVersion('2.0.0')
            .addBearerAuth()
            .addServer(process.env.BASE_URL || 'http://localhost:3000', 'Development Server')
            .addServer('https://pawpromise-backend.onrender.com', 'Production Server')
            .addTag('Authentication', 'User registration, login, and account management')
            .addTag('Pets', 'Pet profile management and detailed information')
            .addTag('Consultations', 'Virtual veterinary consultations with real-time updates')
            .addTag('Activity Tracking', 'Daily activity and diet logging')
            .addTag('Health Records', 'Medical history and health tracking')
            .addTag('Medications', 'Medication management and reminders')
            .addTag('Appointments', 'Veterinary appointment scheduling')
            .addTag('Insurance', 'Pet insurance policies and claims')
            .addTag('Health Reminders', 'Automated health notifications')
            .addTag('Seed', 'Database seeding for development')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api', app, document, {
            customSiteTitle: '🐾 PawPromise API Documentation',
            customfavIcon: '/favicon.ico',
            customCss: `
        .topbar-wrapper .link { content: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjRkY2QjM1Ii8+Cjwvc3ZnPgo='); }
        .swagger-ui .topbar { background-color: #1f2937; }
        .swagger-ui .info .title { color: #f59e0b; }
      `,
            swaggerOptions: {
                persistAuthorization: true,
                displayRequestDuration: true,
                filter: true,
                showExtensions: true,
                showCommonExtensions: true,
            },
        });
    }
    const port = parseInt(process.env.PORT || '3000', 10);
    await app.listen(port, '0.0.0.0');
    common_1.Logger.log(`PawMundo Backend running on port ${port}`, 'Bootstrap');
    if (process.env.ENABLE_SWAGGER === 'true') {
        const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;
        common_1.Logger.log(`Swagger documentation available at ${baseUrl}/api`, 'Bootstrap');
    }
}
bootstrap();

})();

/******/ })()
;