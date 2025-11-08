import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { MailService } from '../../common/utils/mail.service';
export declare class AuthService {
    private userModel;
    private jwtService;
    private mailService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService, mailService: MailService);
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: unknown;
            email: string;
            firstName: string;
            lastName: string;
            role: string;
            isEmailVerified: boolean;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            role: any;
            isEmailVerified: any;
            lastLogin: Date;
        };
    }>;
    validateUser(email: string, password: string): Promise<any>;
    findById(id: string): Promise<User>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    updateProfile(userId: string, updateData: Partial<User>): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}, {}> & User & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
