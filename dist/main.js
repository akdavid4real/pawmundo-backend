/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 3 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(2);
const config_1 = __webpack_require__(4);
const mongoose_1 = __webpack_require__(5);
const schedule_1 = __webpack_require__(6);
const bull_1 = __webpack_require__(7);
const mongodb_config_1 = __webpack_require__(8);
const redis_config_1 = __webpack_require__(9);
const cloudinary_config_1 = __webpack_require__(10);
const auth_module_1 = __webpack_require__(11);
const user_module_1 = __webpack_require__(32);
const pets_module_1 = __webpack_require__(37);
const appointments_module_1 = __webpack_require__(44);
const health_records_module_1 = __webpack_require__(50);
const medications_module_1 = __webpack_require__(56);
const health_reminders_module_1 = __webpack_require__(57);
const consultations_module_1 = __webpack_require__(60);
const insurance_module_1 = __webpack_require__(61);
const symptom_checker_module_1 = __webpack_require__(62);
const forum_module_1 = __webpack_require__(63);
const notifications_module_1 = __webpack_require__(64);
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
            schedule_1.ScheduleModule.forRoot(),
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
        ],
    })
], AppModule);


/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("@nestjs/mongoose");

/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("@nestjs/schedule");

/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("@nestjs/bull");

/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MongodbConfig = void 0;
const config_1 = __webpack_require__(4);
exports.MongodbConfig = (0, config_1.registerAs)('mongodb', () => ({
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/pawpromise',
}));


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RedisConfig = void 0;
const config_1 = __webpack_require__(4);
exports.RedisConfig = (0, config_1.registerAs)('redis', () => ({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD,
}));


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CloudinaryConfig = void 0;
const config_1 = __webpack_require__(4);
exports.CloudinaryConfig = (0, config_1.registerAs)('cloudinary', () => ({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
}));


/***/ }),
/* 11 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(2);
const jwt_1 = __webpack_require__(12);
const passport_1 = __webpack_require__(13);
const mongoose_1 = __webpack_require__(5);
const auth_service_1 = __webpack_require__(14);
const auth_controller_1 = __webpack_require__(21);
const user_schema_1 = __webpack_require__(18);
const jwt_strategy_1 = __webpack_require__(28);
const local_strategy_1 = __webpack_require__(30);
const mail_service_1 = __webpack_require__(19);
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
/* 12 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 13 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 14 */
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
const common_1 = __webpack_require__(2);
const mongoose_1 = __webpack_require__(5);
const mongoose_2 = __webpack_require__(15);
const jwt_1 = __webpack_require__(12);
const bcrypt = __webpack_require__(16);
const crypto = __webpack_require__(17);
const user_schema_1 = __webpack_require__(18);
const mail_service_1 = __webpack_require__(19);
let AuthService = class AuthService {
    constructor(userModel, jwtService, mailService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }
    async register(registerDto) {
        const { email, password, firstName, lastName, phone, address } = registerDto;
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const emailVerificationToken = crypto.randomBytes(32).toString('hex');
        const user = new this.userModel({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            phone,
            address,
            emailVerificationToken,
        });
        await user.save();
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
        const { email, password } = loginDto;
        const user = await this.validateUser(email, password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        await this.userModel.findByIdAndUpdate(user._id, { lastLogin: new Date() });
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
                lastLogin: new Date(),
            },
        };
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
        return this.userModel.findById(id).select('-password -emailVerificationToken -passwordResetToken');
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
    async changePassword(userId, changePasswordDto) {
        const { currentPassword, newPassword } = changePasswordDto;
        const user = await this.userModel.findById(userId);
        if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
            throw new common_1.UnauthorizedException('Current password is incorrect');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await this.userModel.findByIdAndUpdate(userId, { password: hashedPassword });
        return { message: 'Password changed successfully' };
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
        const allowedFields = ['firstName', 'lastName', 'phone', 'address', 'profileImage'];
        const filteredData = Object.keys(updateData)
            .filter(key => allowedFields.includes(key))
            .reduce((obj, key) => ({ ...obj, [key]: updateData[key] }), {});
        return this.userModel.findByIdAndUpdate(userId, filteredData, { new: true })
            .select('-password -emailVerificationToken -passwordResetToken');
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object, typeof (_c = typeof mail_service_1.MailService !== "undefined" && mail_service_1.MailService) === "function" ? _c : Object])
], AuthService);


/***/ }),
/* 15 */
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),
/* 16 */
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),
/* 17 */
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),
/* 18 */
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
const mongoose_1 = __webpack_require__(5);
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
/* 19 */
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
const common_1 = __webpack_require__(2);
const nodemailer_1 = __webpack_require__(20);
let MailService = MailService_1 = class MailService {
    constructor() {
        this.logger = new common_1.Logger(MailService_1.name);
        this.transporter = nodemailer_1.default.createTransport({
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
            from: process.env.FROM_EMAIL || 'no-reply@pawpromise.app',
            to: email,
            subject: 'PawPromise — Password reset',
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
/* 20 */
/***/ ((module) => {

module.exports = require("nodemailer");

/***/ }),
/* 21 */
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
const common_1 = __webpack_require__(2);
const passport_1 = __webpack_require__(13);
const auth_service_1 = __webpack_require__(14);
const register_dto_1 = __webpack_require__(22);
const login_dto_1 = __webpack_require__(25);
const forgot_password_dto_1 = __webpack_require__(26);
const reset_password_dto_1 = __webpack_require__(27);
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
/* 22 */
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
const class_validator_1 = __webpack_require__(23);
const swagger_1 = __webpack_require__(24);
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
/* 23 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 24 */
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),
/* 25 */
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
const class_validator_1 = __webpack_require__(23);
const swagger_1 = __webpack_require__(24);
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
/* 26 */
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
const class_validator_1 = __webpack_require__(23);
const swagger_1 = __webpack_require__(24);
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
/* 27 */
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
const class_validator_1 = __webpack_require__(23);
const swagger_1 = __webpack_require__(24);
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
/* 28 */
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
const common_1 = __webpack_require__(2);
const passport_1 = __webpack_require__(13);
const passport_jwt_1 = __webpack_require__(29);
const auth_service_1 = __webpack_require__(14);
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
/* 29 */
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),
/* 30 */
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
const common_1 = __webpack_require__(2);
const passport_1 = __webpack_require__(13);
const passport_local_1 = __webpack_require__(31);
const auth_service_1 = __webpack_require__(14);
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
/* 31 */
/***/ ((module) => {

module.exports = require("passport-local");

/***/ }),
/* 32 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserModule = void 0;
const common_1 = __webpack_require__(2);
const mongoose_1 = __webpack_require__(5);
const user_controller_1 = __webpack_require__(33);
const user_service_1 = __webpack_require__(35);
const user_schema_1 = __webpack_require__(18);
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
/* 33 */
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
const common_1 = __webpack_require__(2);
const jwt_auth_guard_1 = __webpack_require__(34);
const user_service_1 = __webpack_require__(35);
const update_user_dto_1 = __webpack_require__(36);
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
/* 34 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const common_1 = __webpack_require__(2);
const passport_1 = __webpack_require__(13);
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);


/***/ }),
/* 35 */
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
const common_1 = __webpack_require__(2);
const mongoose_1 = __webpack_require__(5);
const mongoose_2 = __webpack_require__(15);
const user_schema_1 = __webpack_require__(18);
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
/* 36 */
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
const class_validator_1 = __webpack_require__(23);
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
/* 37 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PetsModule = void 0;
const common_1 = __webpack_require__(2);
const mongoose_1 = __webpack_require__(5);
const pets_controller_1 = __webpack_require__(38);
const pets_service_1 = __webpack_require__(39);
const pet_schema_1 = __webpack_require__(40);
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
/* 38 */
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
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(24);
const jwt_auth_guard_1 = __webpack_require__(34);
const pets_service_1 = __webpack_require__(39);
const create_pet_dto_1 = __webpack_require__(41);
const update_pet_dto_1 = __webpack_require__(42);
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
/* 39 */
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
const common_1 = __webpack_require__(2);
const mongoose_1 = __webpack_require__(5);
const mongoose_2 = __webpack_require__(15);
const pet_schema_1 = __webpack_require__(40);
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
/* 40 */
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
const mongoose_1 = __webpack_require__(5);
const mongoose_2 = __webpack_require__(15);
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


/***/ }),
/* 41 */
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
const class_validator_1 = __webpack_require__(23);
const swagger_1 = __webpack_require__(24);
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
/* 42 */
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
const mapped_types_1 = __webpack_require__(43);
const class_validator_1 = __webpack_require__(23);
const swagger_1 = __webpack_require__(24);
const create_pet_dto_1 = __webpack_require__(41);
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
/* 43 */
/***/ ((module) => {

module.exports = require("@nestjs/mapped-types");

/***/ }),
/* 44 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppointmentsModule = void 0;
const common_1 = __webpack_require__(2);
const mongoose_1 = __webpack_require__(5);
const appointments_controller_1 = __webpack_require__(45);
const appointments_service_1 = __webpack_require__(46);
const appointment_schema_1 = __webpack_require__(47);
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
/* 45 */
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
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(24);
const jwt_auth_guard_1 = __webpack_require__(34);
const appointments_service_1 = __webpack_require__(46);
const create_appointment_dto_1 = __webpack_require__(48);
const update_appointment_dto_1 = __webpack_require__(49);
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
/* 46 */
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
const common_1 = __webpack_require__(2);
const mongoose_1 = __webpack_require__(5);
const mongoose_2 = __webpack_require__(15);
const appointment_schema_1 = __webpack_require__(47);
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
/* 47 */
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
const mongoose_1 = __webpack_require__(5);
const mongoose_2 = __webpack_require__(15);
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
/* 48 */
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
const class_validator_1 = __webpack_require__(23);
const swagger_1 = __webpack_require__(24);
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
/* 49 */
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
const mapped_types_1 = __webpack_require__(43);
const class_validator_1 = __webpack_require__(23);
const swagger_1 = __webpack_require__(24);
const create_appointment_dto_1 = __webpack_require__(48);
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
/* 50 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HealthRecordsModule = void 0;
const common_1 = __webpack_require__(2);
const mongoose_1 = __webpack_require__(5);
const health_records_controller_1 = __webpack_require__(51);
const health_records_service_1 = __webpack_require__(52);
const health_record_schema_1 = __webpack_require__(53);
const pets_module_1 = __webpack_require__(37);
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
/* 51 */
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
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(24);
const mongoose_1 = __webpack_require__(15);
const jwt_auth_guard_1 = __webpack_require__(34);
const health_records_service_1 = __webpack_require__(52);
const create_health_record_dto_1 = __webpack_require__(54);
const update_health_record_dto_1 = __webpack_require__(55);
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
/* 52 */
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
const common_1 = __webpack_require__(2);
const mongoose_1 = __webpack_require__(5);
const mongoose_2 = __webpack_require__(15);
const health_record_schema_1 = __webpack_require__(53);
const pets_service_1 = __webpack_require__(39);
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
        const record = await this.healthRecordModel.findById(id).populate('petId').exec();
        if (!record)
            throw new common_1.NotFoundException('Health record not found');
        const pet = await this.petsService.findById(record.petId.toString(), userId);
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
        const userPets = await this.petsService.findByOwner(userId);
        const petIds = userPets.map(pet => pet._id);
        const today = new Date();
        const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
        return this.healthRecordModel
            .find({
            petId: { $in: petIds },
            nextDueDate: { $gte: today, $lte: nextMonth },
            isActive: true
        })
            .populate('petId', 'name species breed')
            .sort({ nextDueDate: 1 })
            .exec();
    }
    async getVaccinations(petId, userId) {
        await this.petsService.findById(petId, userId);
        return this.healthRecordModel
            .find({ petId, type: 'vaccination', isActive: true })
            .sort({ date: -1 })
            .exec();
    }
    async getHealthSummary(petId, userId) {
        await this.petsService.findById(petId, userId);
        const records = await this.healthRecordModel.find({ petId, isActive: true }).exec();
        const now = new Date();
        const upcomingReminders = records.filter(r => r.nextDueDate && r.nextDueDate > now);
        const overdueReminders = records.filter(r => r.nextDueDate && r.nextDueDate < now);
        return {
            totalRecords: records.length,
            recordsByType: records.reduce((acc, record) => {
                acc[record.type] = (acc[record.type] || 0) + 1;
                return acc;
            }, {}),
            lastCheckup: records.find(r => r.type === 'checkup')?.date,
            nextReminder: upcomingReminders.sort((a, b) => a.nextDueDate.getTime() - b.nextDueDate.getTime())[0]?.nextDueDate,
            upcomingCount: upcomingReminders.length,
            overdueCount: overdueReminders.length,
            totalCost: records.reduce((sum, r) => sum + (r.cost || 0), 0),
            weightHistory: records.filter(r => r.weight).map(r => ({ date: r.date, weight: r.weight })).sort((a, b) => a.date.getTime() - b.date.getTime())
        };
    }
    async getOverdueReminders(userId) {
        const userPets = await this.petsService.findByOwner(userId);
        const petIds = userPets.map(pet => pet._id);
        const today = new Date();
        return this.healthRecordModel
            .find({
            petId: { $in: petIds },
            nextDueDate: { $lt: today },
            isActive: true
        })
            .populate('petId', 'name species breed')
            .sort({ nextDueDate: 1 })
            .exec();
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
        const userPets = await this.petsService.findByOwner(userId);
        const petIds = userPets.map(pet => pet._id);
        const records = await this.healthRecordModel.find({ petId: { $in: petIds }, isActive: true }).exec();
        const now = new Date();
        const thisYear = new Date(now.getFullYear(), 0, 1);
        const thisYearRecords = records.filter(r => r.date >= thisYear);
        const upcomingReminders = records.filter(r => r.nextDueDate && r.nextDueDate > now && r.nextDueDate <= new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000));
        return {
            totalPets: userPets.length,
            totalRecords: records.length,
            recordsThisYear: thisYearRecords.length,
            upcomingReminders: upcomingReminders.length,
            totalSpent: records.reduce((sum, r) => sum + (r.cost || 0), 0),
            spentThisYear: thisYearRecords.reduce((sum, r) => sum + (r.cost || 0), 0),
            recordsByMonth: this.getRecordsByMonth(thisYearRecords),
            mostCommonType: this.getMostCommonRecordType(records)
        };
    }
    getRecordsByMonth(records) {
        const months = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, count: 0 }));
        records.forEach(record => {
            const month = record.date.getMonth();
            months[month].count++;
        });
        return months;
    }
    getMostCommonRecordType(records) {
        const typeCounts = records.reduce((acc, record) => {
            acc[record.type] = (acc[record.type] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(typeCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || null;
    }
};
exports.HealthRecordsService = HealthRecordsService;
exports.HealthRecordsService = HealthRecordsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(health_record_schema_1.HealthRecord.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof pets_service_1.PetsService !== "undefined" && pets_service_1.PetsService) === "function" ? _b : Object])
], HealthRecordsService);


/***/ }),
/* 53 */
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
const mongoose_1 = __webpack_require__(5);
const mongoose_2 = __webpack_require__(15);
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


/***/ }),
/* 54 */
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
const class_validator_1 = __webpack_require__(23);
const swagger_1 = __webpack_require__(24);
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
/* 55 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateHealthRecordDto = void 0;
const mapped_types_1 = __webpack_require__(43);
const create_health_record_dto_1 = __webpack_require__(54);
class UpdateHealthRecordDto extends (0, mapped_types_1.PartialType)(create_health_record_dto_1.CreateHealthRecordDto) {
}
exports.UpdateHealthRecordDto = UpdateHealthRecordDto;


/***/ }),
/* 56 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MedicationsModule = void 0;
const common_1 = __webpack_require__(2);
let MedicationsModule = class MedicationsModule {
};
exports.MedicationsModule = MedicationsModule;
exports.MedicationsModule = MedicationsModule = __decorate([
    (0, common_1.Module)({})
], MedicationsModule);


/***/ }),
/* 57 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HealthRemindersModule = void 0;
const common_1 = __webpack_require__(2);
const health_reminders_controller_1 = __webpack_require__(58);
const health_reminders_service_1 = __webpack_require__(59);
const health_records_module_1 = __webpack_require__(50);
const pets_module_1 = __webpack_require__(37);
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
/* 58 */
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
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(24);
const jwt_auth_guard_1 = __webpack_require__(34);
const health_reminders_service_1 = __webpack_require__(59);
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
/* 59 */
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
const common_1 = __webpack_require__(2);
const schedule_1 = __webpack_require__(6);
const health_records_service_1 = __webpack_require__(52);
const pets_service_1 = __webpack_require__(39);
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
/* 60 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConsultationsModule = void 0;
const common_1 = __webpack_require__(2);
let ConsultationsModule = class ConsultationsModule {
};
exports.ConsultationsModule = ConsultationsModule;
exports.ConsultationsModule = ConsultationsModule = __decorate([
    (0, common_1.Module)({})
], ConsultationsModule);


/***/ }),
/* 61 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InsuranceModule = void 0;
const common_1 = __webpack_require__(2);
let InsuranceModule = class InsuranceModule {
};
exports.InsuranceModule = InsuranceModule;
exports.InsuranceModule = InsuranceModule = __decorate([
    (0, common_1.Module)({})
], InsuranceModule);


/***/ }),
/* 62 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SymptomCheckerModule = void 0;
const common_1 = __webpack_require__(2);
let SymptomCheckerModule = class SymptomCheckerModule {
};
exports.SymptomCheckerModule = SymptomCheckerModule;
exports.SymptomCheckerModule = SymptomCheckerModule = __decorate([
    (0, common_1.Module)({})
], SymptomCheckerModule);


/***/ }),
/* 63 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ForumModule = void 0;
const common_1 = __webpack_require__(2);
let ForumModule = class ForumModule {
};
exports.ForumModule = ForumModule;
exports.ForumModule = ForumModule = __decorate([
    (0, common_1.Module)({})
], ForumModule);


/***/ }),
/* 64 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationsModule = void 0;
const common_1 = __webpack_require__(2);
let NotificationsModule = class NotificationsModule {
};
exports.NotificationsModule = NotificationsModule;
exports.NotificationsModule = NotificationsModule = __decorate([
    (0, common_1.Module)({})
], NotificationsModule);


/***/ }),
/* 65 */
/***/ ((module) => {

module.exports = require("path");

/***/ })
/******/ 	]);
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

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const app_module_1 = __webpack_require__(3);
const path_1 = __webpack_require__(65);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors();
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'));
    const port = process.env.PORT || 3000;
    await app.listen(port);
    common_1.Logger.log(`PawPromise Backend running on port ${port}`, 'Bootstrap');
    common_1.Logger.log(`Frontend available at http://localhost:${port}`, 'Bootstrap');
}
bootstrap();

})();

/******/ })()
;