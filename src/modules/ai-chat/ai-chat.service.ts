import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AiChatDto } from './dto/ai-chat.dto';
import { SymptomCheckerService } from '../symptom-checker/symptom-checker.service';
import { PetsService } from '../pets/pets.service';
import { HealthRecordsService } from '../health-records/health-records.service';
import { AppointmentsService } from '../appointments/appointments.service';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class AiChatService {
  constructor(
    private symptomCheckerService: SymptomCheckerService,
    private petsService: PetsService,
    private healthRecordsService: HealthRecordsService,
    private appointmentsService: AppointmentsService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async chat(userId: string, aiChatDto: AiChatDto) {
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
          if (pet.weight) petDetail += `, ${pet.weight}kg`;
          if (pet.color) petDetail += `, ${pet.color}`;
          if (pet.microchipId) petDetail += `, chip: ${pet.microchipId}`;
          if (pet.allergies?.length) petDetail += `, allergies: ${pet.allergies.join(', ')}`;
          if (pet.medicalNotes) petDetail += `, notes: ${pet.medicalNotes}`;
          
          petDetail += `. Health: ${healthSummary.totalRecords} records`;
          if (healthSummary.lastCheckup) petDetail += `, last checkup: ${new Date(healthSummary.lastCheckup).toLocaleDateString()}`;
          if (healthSummary.upcomingCount) petDetail += `, ${healthSummary.upcomingCount} upcoming`;
          if (healthSummary.overdueCount) petDetail += `, ${healthSummary.overdueCount} overdue`;
          
          if (healthRecords.length > 0) {
            const recentRecords = healthRecords.slice(0, 3).map(r => 
              `${r.type}: ${r.title} (${new Date(r.date).toLocaleDateString()})`
            );
            petDetail += `. Recent: ${recentRecords.join('; ')}`;
          }
          
          petDetails.push(petDetail);
        } catch (error) {
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
        `${(apt.petId as any)?.name || 'Pet'}: ${apt.reason} with ${apt.vetName} at ${apt.vetClinic} on ${new Date(apt.appointmentDate).toLocaleDateString()} (${apt.status})`
      );
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
    } catch (error) {
      console.error('AI Chat Error:', error);
      
      // Provide concise fallback response with pet info
      let fallbackResponse = `Hi ${userName}! `;
      
      if (pets && pets.length > 0) {
        fallbackResponse += `I can see your ${pets.length} pet${pets.length > 1 ? 's' : ''} (${pets.map(p => p.name).join(', ')}) but having connectivity issues. Please try again.`;
      } else {
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

  async getOfflineResponse(userId: string, message: string) {
    const [user, pets] = await Promise.all([
      this.userModel.findById(userId).exec(),
      this.petsService.findByOwner(userId)
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
      timestamp: new Date().toISOString()
    };
  }
}