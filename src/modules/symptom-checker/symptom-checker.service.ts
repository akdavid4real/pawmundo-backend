import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pet } from '../pets/schemas/pet.schema';
import { HealthRecord } from '../health-records/schemas/health-record.schema';
import { Medication } from '../medications/schemas/medication.schema';
import { SymptomCheckDto } from './dto/symptom-check.dto';

@Injectable()
export class SymptomCheckerService {
  constructor(
    @InjectModel(Pet.name) private petModel: Model<Pet>,
    @InjectModel(HealthRecord.name) private healthRecordModel: Model<HealthRecord>,
    @InjectModel(Medication.name) private medicationModel: Model<Medication>,
  ) {}

  async checkSymptoms(userId: string, symptomCheckDto: SymptomCheckDto) {
    // Get pet data
    const pet = await this.petModel.findById(symptomCheckDto.petId).exec();
    if (!pet) {
      throw new NotFoundException(`Pet with ID '${symptomCheckDto.petId}' does not exist`);
    }
    if (pet.ownerId.toString() !== userId) {
      throw new NotFoundException(`You don't have permission to access pet '${pet.name}' (ID: ${symptomCheckDto.petId}). This pet belongs to another user.`);
    }

    // Get medical history
    const healthRecords = await this.healthRecordModel
      .find({ petId: symptomCheckDto.petId, isActive: true })
      .sort({ date: -1 })
      .limit(10)
      .exec();

    // Get current medications
    const medications = await this.medicationModel
      .find({ petId: symptomCheckDto.petId, status: 'active' })
      .exec();

    // Build context for AI
    const petContext = this.buildPetContext(pet, healthRecords, medications);
    
    // Call Mistral AI
    const aiResponse = await this.callMistralAI(petContext, symptomCheckDto);
    
    return {
      petInfo: {
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        age: pet.age
      },
      analysis: aiResponse,
      timestamp: new Date()
    };
  }

  private buildPetContext(pet: any, healthRecords: any[], medications: any[]): string {
    const context = `
Pet Information:
- Name: ${pet.name}
- Species: ${pet.species}
- Breed: ${pet.breed}
- Age: ${pet.age} years
- Gender: ${pet.gender}
- Weight: ${pet.weight || 'Not specified'} kg
- Current Health Status: ${pet.healthStatus}

Recent Medical History (Last 10 records):
${healthRecords.map(record => 
  `- ${record.date.toDateString()}: ${record.type} - ${record.description}${record.notes ? ` (${record.notes})` : ''}`
).join('\n')}

Current Medications:
${medications.length > 0 ? 
  medications.map(med => 
    `- ${med.name}: ${med.dosage} ${med.frequency} (${med.instructions})`
  ).join('\n') : 
  'No current medications'
}`;

    return context;
  }

  private async callMistralAI(petContext: string, symptomCheckDto: SymptomCheckDto): Promise<any> {
    const prompt = `You are a veterinary AI assistant. Based on the pet's medical history and current symptoms, provide a professional assessment.

${petContext}

Current Symptoms:
- Symptoms: ${symptomCheckDto.symptoms.join(', ')}
- Duration: ${symptomCheckDto.duration}
- Severity: ${symptomCheckDto.severity}/4
- Additional Info: ${symptomCheckDto.additionalInfo || 'None'}

Please provide:
1. Urgency level (Emergency, Urgent, Monitor, Normal)
2. Possible conditions (3-5 most likely)
3. Immediate recommendations
4. Whether veterinary consultation is needed
5. Warning signs to watch for

Format your response as JSON with these fields: urgencyLevel, possibleConditions, recommendations, vetRequired, warningSignsToWatch.`;

    try {
      const response = await fetch(`${process.env.MISTRAL_API_BASE}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`
        },
        body: JSON.stringify({
          model: 'mistral-large-latest',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: 1000
        })
      });

      const data = await response.json();
      const aiContent = data.choices[0].message.content;
      
      try {
        return JSON.parse(aiContent);
      } catch {
        return {
          urgencyLevel: 'Monitor',
          possibleConditions: ['Unable to parse AI response'],
          recommendations: [aiContent],
          vetRequired: true,
          warningSignsToWatch: ['Monitor pet closely']
        };
      }
    } catch (error) {
      return {
        urgencyLevel: 'Monitor',
        possibleConditions: ['AI service unavailable'],
        recommendations: ['Please consult with a veterinarian for proper diagnosis'],
        vetRequired: true,
        warningSignsToWatch: ['Any worsening of symptoms']
      };
    }
  }
}