import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

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
import { AiChatModule } from '@modules/ai-chat/ai-chat.module';
import { ForumModule } from '@modules/forum/forum.module';
import { NotificationsModule } from '@modules/notifications/notifications.module';
import { ActivityTrackingModule } from '@modules/activity-tracking/activity-tracking.module';
import { EventsModule } from '@modules/events/events.module';
import { SeedModule } from '@modules/seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [MongodbConfig, RedisConfig, CloudinaryConfig],
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/pawpromise',
        maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE || '10'),
        minPoolSize: parseInt(process.env.MONGODB_MIN_POOL_SIZE || '2'),
        maxIdleTimeMS: parseInt(process.env.MONGODB_MAX_IDLE_TIME || '30000'),
        serverSelectionTimeoutMS: parseInt(process.env.MONGODB_SERVER_SELECTION_TIMEOUT || '5000'),
        socketTimeoutMS: parseInt(process.env.MONGODB_SOCKET_TIMEOUT || '45000'),
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
    AiChatModule,
    ForumModule,
    NotificationsModule,
    ActivityTrackingModule,
    EventsModule,
    SeedModule,
  ],
})
export class AppModule {}