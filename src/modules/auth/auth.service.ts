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
        throw new ConflictException('User with this email already exists');
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
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      DatabaseErrorHandler.handle(error, 'User registration');
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

  async login(loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;
      
      const user = await this.validateUser(email, password);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
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
      ValidationUtil.validateObjectId(id, 'User ID');
      return this.userModel.findById(id).select('-password -emailVerificationToken -passwordResetToken');
    } catch (error) {
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
        throw new BadRequestException('Invalid or expired reset token');
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
        throw new UnauthorizedException('User not found');
      }
      
      if (!(await bcrypt.compare(currentPassword, user.password))) {
        throw new UnauthorizedException('Current password is incorrect');
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
      throw new BadRequestException('Invalid verification token');
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