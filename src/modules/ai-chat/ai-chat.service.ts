import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiChatDto } from './dto/ai-chat.dto';
import { SymptomCheckerService } from '../symptom-checker/symptom-checker.service';
import { PetsService } from '../pets/pets.service';
import { HealthRecordsService } from '../health-records/health-records.service';
import { AppointmentsService } from '../appointments/appointments.service';
import { EntitlementsService } from '../entitlements/entitlements.service';

@Injectable()
export class AiChatService {
  constructor(
    private prisma: PrismaService,
    private symptomCheckerService: SymptomCheckerService,
    private petsService: PetsService,
    private healthRecordsService: HealthRecordsService,
    private appointmentsService: AppointmentsService,
    private entitlementsService: EntitlementsService,
  ) { }

  async chat(userId: string, aiChatDto: AiChatDto) {
    const { message, context, image } = aiChatDto;
    const plan = await this.entitlementsService.requireAiChat(userId);

    const [user, pets, upcomingAppointments] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.petsService.findByOwner(userId),
      this.appointmentsService.findUpcoming(userId),
    ]);

    const userName = user ? user.firstName : 'there';

    let petInfo = '';
    if (pets.length > 0) {
      const petDetails = [];
      for (const pet of pets) {
        try {
          const [healthSummary, healthRecords] = await Promise.all([
            this.healthRecordsService.getHealthSummary(pet.id, userId),
            this.healthRecordsService.findByPet(pet.id, userId),
          ]);

          let petDetail = `${pet.name}: ${pet.species} ${pet.breed}, ${pet.age}yo, ${pet.gender}, ${pet.healthStatus}`;
          if (pet.weight) petDetail += `, ${pet.weight}kg`;
          if (pet.color) petDetail += `, ${pet.color}`;
          if (pet.allergies?.length) petDetail += `, allergies: ${pet.allergies.join(', ')}`;

          petDetail += `. Health: ${healthSummary.totalRecords} records`;
          if (healthSummary.lastCheckup) petDetail += `, last checkup: ${new Date(healthSummary.lastCheckup).toLocaleDateString()}`;
          if (healthSummary.upcomingCount) petDetail += `, ${healthSummary.upcomingCount} upcoming`;
          if (healthSummary.overdueCount) petDetail += `, ${healthSummary.overdueCount} overdue`;

          if (healthRecords.length > 0) {
            const recentRecords = healthRecords.slice(0, 3).map(r =>
              `${r.type}: ${r.title} (${new Date(r.date).toLocaleDateString()})`,
            );
            petDetail += `. Recent: ${recentRecords.join('; ')}`;
          }

          petDetails.push(petDetail);
        } catch {
          let petDetail = `${pet.name}: ${pet.species} ${pet.breed}, ${pet.age}yo, ${pet.gender}, ${pet.healthStatus}`;
          if (pet.allergies?.length) petDetail += `, allergies: ${pet.allergies.join(', ')}`;
          petDetails.push(petDetail);
        }
      }
      petInfo = petDetails.join('\n\n');
    } else {
      petInfo = 'No pets registered';
    }

    let appointmentInfo = '';
    if (upcomingAppointments.length > 0) {
      const appointmentDetails = upcomingAppointments.map(apt =>
        `${(apt as any).pet?.name || 'Pet'}: ${apt.reason} with ${apt.vetName} at ${apt.vetClinic} on ${new Date(apt.appointmentDate).toLocaleDateString()} (${apt.status})`,
      );
      appointmentInfo = `\n\nUpcoming Appointments: ${appointmentDetails.join('; ')}`;
    }

    const fullContext = `You are Dr. Woofson, a professional AI veterinarian. Be helpful and concise. Keep responses under 100 words. Address ${userName} by name. Reference specific pet details when relevant.

${petInfo}${appointmentInfo}
${context ? `Context: ${this.formatContext(context)}` : ''}
${image ? 'The user attached an image. Analyze it cautiously and explain that image-based advice is not a substitute for in-person veterinary care.' : ''}`;

    const prompt = `${fullContext}\n\n${userName}: ${message}\n\nDr. Woofson (be brief and professional):`;
    const content = image
      ? [
        { type: 'text', text: prompt },
        {
          type: 'image_url',
          image_url: `data:${image.mimeType};base64,${image.base64}`,
        },
      ]
      : prompt;

    try {
      const response = await fetch(`${process.env.MISTRAL_API_BASE || 'https://api.mistral.ai'}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
        },
        body: JSON.stringify({
          model: image
            ? process.env.MISTRAL_VISION_MODEL || 'mistral-small-latest'
            : process.env.MISTRAL_CHAT_MODEL || 'mistral-large-latest',
          messages: [{ role: 'user', content }],
          temperature: 0.7,
          max_tokens: 150,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded - too many requests');
        }
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      await this.entitlementsService.recordFreeMonthlyUsage(userId, 'ai_chat', plan);

      return {
        response: aiResponse,
        typewriter: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('AI Chat Error:', error);

      let fallbackResponse = `Hi ${userName}! `;
      if (pets?.length > 0) {
        fallbackResponse += `I can see your ${pets.length} pet${pets.length > 1 ? 's' : ''} (${pets.map(p => p.name).join(', ')}) but having connectivity issues. Please try again.`;
      } else {
        fallbackResponse += `I'm here to help with pet questions. Having connectivity issues - please try again.`;
      }

      await this.entitlementsService.recordFreeMonthlyUsage(userId, 'ai_chat', plan);

      return {
        response: fallbackResponse,
        typewriter: true,
        timestamp: new Date().toISOString(),
      };
    }
  }

  private formatContext(context: string | Record<string, unknown>): string {
    if (typeof context === 'string') {
      return context;
    }

    try {
      return JSON.stringify(context);
    } catch {
      return '';
    }
  }

  async getTypingIndicator() {
    return {
      isTyping: true,
      message: 'Typing...',
      timestamp: new Date().toISOString(),
    };
  }

  async getOfflineResponse(userId: string, message: string) {
    const [user, pets] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.petsService.findByOwner(userId),
    ]);

    const userName = user ? user.firstName : 'there';

    let response = `Hi ${userName}! `;
    if (pets.length > 0) {
      response += `I can see your ${pets.length} pet${pets.length > 1 ? 's' : ''} (${pets.map(p => p.name).join(', ')}) but having connectivity issues. Please try again.`;
    } else {
      response += `I'm here to help with pet questions. Having connectivity issues - please try again.`;
    }

    return {
      response,
      typewriter: true,
      timestamp: new Date().toISOString(),
    };
  }
}
