import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';

// Configuration
import { MongodbConfig } from '@config/mongodb.config';
import { RedisConfig } from '@config/redis.config';
import { CloudinaryConfig } from '@config/cloudinary.config';

// Modules
import { AuthModule } from '@modules/auth/auth.module';
import { UserModule } from '@modules/user/user.module';
import { PetsModule } from '@modules/pets/pets.module';
import { AppointmentsModule } from '@modules/appointments/appointments.module';
import { HealthRecordsModule } from '@modules/health-records/health-records.module';
import { MedicationsModule } from '@modules/medications/medications.module';
import { HealthRemindersModule } from '@modules/health-reminders/health-reminders.module';
import { ConsultationsModule } from '@modules/consultations/consultations.module';
import { InsuranceModule } from '@modules/insurance/insurance.module';
import { SymptomCheckerModule } from '@modules/symptom-checker/symptom-checker.module';
import { ForumModule } from '@modules/forum/forum.module';
import { NotificationsModule } from '@modules/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [MongodbConfig, RedisConfig, CloudinaryConfig],
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/pawpromise',
      }),
    }),
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT) || 6379,
        },
      }),
    }),
    ScheduleModule.forRoot(),
    
    // Domain Modules
    AuthModule,
    UserModule,
    PetsModule,
    AppointmentsModule,
    HealthRecordsModule,
    MedicationsModule,
    HealthRemindersModule,
    ConsultationsModule,
    InsuranceModule,
    SymptomCheckerModule,
    ForumModule,
    NotificationsModule,
  ],
})
export class AppModule {}