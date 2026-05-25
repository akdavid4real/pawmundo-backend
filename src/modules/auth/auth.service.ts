import { Injectable, ConflictException, UnauthorizedException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { MailService } from '../../common/utils/mail.service';
import { DatabaseErrorHandler } from '../../common/utils/database-error.handler';
import { ClinicMembershipRole, ClinicMembershipStatus, ClinicVerificationStatus, UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) { }

  async register(registerDto: RegisterDto) {
    let user: any;

    try {
      const { email, password, firstName, lastName, phone, address, clinicId } = registerDto;

      const existingUser = await this.prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new ConflictException(`An account with email '${email}' already exists. Please use a different email or try logging in.`);
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const emailVerificationToken = crypto.randomBytes(32).toString('hex');

      const role = (registerDto.role as UserRole) || UserRole.user;

      if (clinicId && role !== UserRole.vet) {
        throw new BadRequestException('Only vet registrations can request clinic membership');
      }

      user = await this.prisma.$transaction(async tx => {
        if (clinicId) {
          const clinic = await tx.clinic.findFirst({
            where: {
              id: clinicId,
              isActive: true,
              verificationStatus: ClinicVerificationStatus.approved,
            },
          });

          if (!clinic) {
            throw new BadRequestException('Clinic not found or not approved yet');
          }
        }

        const createdUser = await tx.user.create({
          data: {
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role,
            phone,
            address,
            emailVerificationToken,
          },
        });

        if (clinicId) {
          await tx.clinicMembership.create({
            data: {
              clinicId,
              userId: createdUser.id,
              role: ClinicMembershipRole.vet,
              status: ClinicMembershipStatus.pending,
            },
          });
        }

        return createdUser;
      });
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) throw error;
      DatabaseErrorHandler.handle(error, 'User registration');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        clinicMembershipStatus: registerDto.clinicId ? ClinicMembershipStatus.pending : undefined,
      },
    };
  }

  async login(loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;

      const user = await this.validateUser(email, password);
      if (!user) {
        throw new UnauthorizedException(`The account for this email doesn't exist or the password is incorrect. Please try again.`);
      }

      await this.ensureUserCanLogin(user.id, user.role);

      const lastLogin = new Date();
      await this.prisma.user.update({
        where: { id: user.id },
        data: { lastLogin },
      });

      const payload = { email: user.email, sub: user.id, role: user.role };
      const token = this.jwtService.sign(payload);

      return {
        access_token: token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          lastLogin,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof ForbiddenException) throw error;
      DatabaseErrorHandler.handle(error, 'User login');
    }
  }

  private async ensureUserCanLogin(userId: string, role: UserRole) {
    if (role !== UserRole.vet && role !== UserRole.clinic_admin) return;

    const memberships = await this.prisma.clinicMembership.findMany({
      where: { userId },
      include: { clinic: true },
    });

    if (memberships.length === 0) return;

    const hasActiveApprovedMembership = memberships.some(membership =>
      membership.status === ClinicMembershipStatus.active &&
      membership.clinic.isActive &&
      membership.clinic.verificationStatus === ClinicVerificationStatus.approved,
    );

    if (!hasActiveApprovedMembership) {
      throw new ForbiddenException(
        role === UserRole.clinic_admin
          ? 'Clinic account is waiting for platform approval'
          : 'Vet account is waiting for clinic approval',
      );
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async findById(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        omit: { password: true, emailVerificationToken: true, passwordResetToken: true },
      });
      return user;
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'Find user by ID');
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Don't reveal if email exists
      return { message: 'If email exists, password reset link has been sent' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: hashedToken,
        passwordResetExpires: resetExpires,
      },
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
      const user = await this.prisma.user.findFirst({
        where: {
          passwordResetToken: hashedToken,
          passwordResetExpires: { gt: new Date() },
        },
      });

      if (!user) {
        throw new BadRequestException(`Password reset token is invalid or has expired. Please request a new password reset link.`);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          passwordResetToken: null,
          passwordResetExpires: null,
        },
      });

      return { message: 'Password reset successfully' };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      DatabaseErrorHandler.handle(error, 'Password reset');
    }
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    try {
      const { currentPassword, newPassword } = changePasswordDto;

      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new UnauthorizedException(`User account not found. Please check if you're logged in correctly.`);
      }

      if (!(await bcrypt.compare(currentPassword, user.password))) {
        throw new UnauthorizedException(`Current password is incorrect. Please enter your current password correctly.`);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      return { message: 'Password changed successfully' };
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) throw error;
      DatabaseErrorHandler.handle(error, 'Password change');
    }
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new BadRequestException(`Email verification token is invalid or has already been used. Please request a new verification email.`);
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
      },
    });

    return { message: 'Email verified successfully' };
  }

  async updateProfile(userId: string, updateData: any) {
    try {
      const allowedFields = ['firstName', 'lastName', 'phone', 'address', 'profileImage'];
      const filteredData = Object.keys(updateData)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => ({ ...obj, [key]: updateData[key] }), {});

      return this.prisma.user.update({
        where: { id: userId },
        data: filteredData,
        omit: { password: true, emailVerificationToken: true, passwordResetToken: true },
      });
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'Profile update');
    }
  }
}
