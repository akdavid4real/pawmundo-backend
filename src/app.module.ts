import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PetsModule } from './modules/pets/pets.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { HealthRecordsModule } from './modules/health-records/health-records.module';
import { MedicationsModule } from './modules/medications/medications.module';
import { HealthRemindersModule } from './modules/health-reminders/health-reminders.module';
import { ConsultationsModule } from './modules/consultations/consultations.module';
import { InsuranceModule } from './modules/insurance/insurance.module';
import { SymptomCheckerModule } from './modules/symptom-checker/symptom-checker.module';
import { AiChatModule } from './modules/ai-chat/ai-chat.module';
import { ForumModule } from './modules/forum/forum.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ActivityTrackingModule } from './modules/activity-tracking/activity-tracking.module';
import { EventsModule } from './modules/events/events.module';
import { SeedModule } from './modules/seed/seed.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { SupabaseModule } from './modules/supabase/supabase.module';

// Middleware
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),

    // Infrastructure Modules
    PrismaModule,
    SupabaseModule,

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
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
