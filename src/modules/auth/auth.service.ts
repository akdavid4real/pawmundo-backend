import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { MailService } from '../../common/utils/mail.service';
import { ValidationUtil } from '../../common/utils/validation.util';
import { DatabaseErrorHandler } from '../../common/utils/database-error.handler';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(registerDto: RegisterDto) {
    let user: UserDocument;
    
    try {
      const { email, password, firstName, lastName, phone, address } = registerDto;

      const existingUser = await this.userModel.findOne({ email });
      if (existingUser) {
        throw new ConflictException(`An account with email '${email}' already exists. Please use a different email or try logging in.`);
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
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      DatabaseErrorHandler.handle(error, 'User registration');
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

  async login(loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;
      
      const user = await this.validateUser(email, password);
      if (!user) {
        throw new UnauthorizedException(`Login failed: Invalid email or password. Please check your credentials and try again.`);
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
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      DatabaseErrorHandler.handle(error, 'User login');
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async findById(id: string): Promise<User> {
    try {
      console.log('🔍 AuthService findById called with:', id, 'type:', typeof id);
      ValidationUtil.validateObjectId(id, 'User ID');
      const user = await this.userModel.findById(id).select('-password -emailVerificationToken -passwordResetToken');
      console.log('🔍 AuthService findById result:', user ? 'User found' : 'User not found');
      if (user) {
        console.log('🔍 User _id:', user._id, 'type:', typeof user._id);
      }
      return user;
    } catch (error) {
      console.log('🔍 AuthService findById error:', error.message);
      DatabaseErrorHandler.handle(error, 'Find user by ID');
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.userModel.findOne({ email });
    
    if (!user) {
      // Don't reveal if email exists
      return { message: 'If email exists, password reset link has been sent' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.userModel.findByIdAndUpdate(user._id, {
      passwordResetToken: hashedToken,
      passwordResetExpires: resetExpires,
    });

    // send email with the raw token
    try {
      await this.mailService.sendResetPassword(user.email, resetToken);
    } catch (err) {
      // Log/send but do not reveal to client
    }

    return { message: 'If email exists, password reset link has been sent' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      const { token, newPassword } = resetPasswordDto;
      
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
      const user = await this.userModel.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: new Date() },
      });

      if (!user) {
        throw new BadRequestException(`Password reset token is invalid or has expired. Please request a new password reset link.`);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      
      await this.userModel.findByIdAndUpdate(user._id, {
        password: hashedPassword,
        passwordResetToken: undefined,
        passwordResetExpires: undefined,
      });

      return { message: 'Password reset successfully' };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      DatabaseErrorHandler.handle(error, 'Password reset');
    }
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    try {
      ValidationUtil.validateObjectId(userId, 'User ID');
      const { currentPassword, newPassword } = changePasswordDto;
      
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new UnauthorizedException(`User account not found. Please check if you're logged in correctly.`);
      }
      
      if (!(await bcrypt.compare(currentPassword, user.password))) {
        throw new UnauthorizedException(`Current password is incorrect. Please enter your current password correctly.`);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await this.userModel.findByIdAndUpdate(userId, { password: hashedPassword });

      return { message: 'Password changed successfully' };
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) throw error;
      DatabaseErrorHandler.handle(error, 'Password change');
    }
  }

  async verifyEmail(token: string) {
    const user = await this.userModel.findOne({ emailVerificationToken: token });
    
    if (!user) {
      throw new BadRequestException(`Email verification token is invalid or has already been used. Please request a new verification email.`);
    }

    await this.userModel.findByIdAndUpdate(user._id, {
      isEmailVerified: true,
      emailVerificationToken: undefined,
    });

    return { message: 'Email verified successfully' };
  }

  async updateProfile(userId: string, updateData: Partial<User>) {
    try {
      ValidationUtil.validateObjectId(userId, 'User ID');
      const allowedFields = ['firstName', 'lastName', 'phone', 'address', 'profileImage'];
      const filteredData = Object.keys(updateData)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => ({ ...obj, [key]: updateData[key] }), {});

      return this.userModel.findByIdAndUpdate(userId, filteredData, { new: true })
        .select('-password -emailVerificationToken -passwordResetToken');
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'Profile update');
    }
  }
}