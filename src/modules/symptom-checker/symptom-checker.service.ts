import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SymptomCheckDto } from './dto/symptom-check.dto';

@Injectable()
export class SymptomCheckerService {
  constructor(private prisma: PrismaService) { }

  async extractPetContext(userId: string, message: string): Promise<string> {
    const [user, userPets] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.prisma.pet.findMany({ where: { ownerId: userId, isActive: true } }),
    ]);

    if (userPets.length === 0) return '';

    const mentionedPets = this.findMentionedPets(userPets, message);
    const petsToShow = mentionedPets.length > 0 ? mentionedPets : userPets;

    const contexts = await Promise.all(
      petsToShow.map(pet => this.getPetDetailedContext(pet)),
    );

    const userInfo = user ? `**${user.firstName}'s Pet Information:**\n` : '';
    return userInfo + contexts.filter(Boolean).join('\n\n');
  }

  private findMentionedPets(userPets: any[], message: string): any[] {
    const messageLower = message.toLowerCase();
    const words = messageLower.split(/\s+/);

    return userPets.filter(pet => {
      const petNameLower = pet.name.toLowerCase();
      return words.some(word =>
        word === petNameLower ||
        word.includes(petNameLower) ||
        petNameLower.includes(word),
      ) || messageLower.includes(petNameLower);
    });
  }

  private async getPetDetailedContext(pet: any): Promise<string> {
    const [healthRecords, medications] = await Promise.all([
      this.prisma.healthRecord.findMany({
        where: { petId: pet.id, isActive: true },
        orderBy: { date: 'desc' },
        take: 5,
      }),
      this.prisma.medication.findMany({
        where: { petId: pet.id, isActive: true, isCompleted: false },
      }),
    ]);

    return `**${pet.name}'s Complete Profile:**
- Species: ${pet.species} | Breed: ${pet.breed || 'Mixed'} | Age: ${pet.age} years
- Gender: ${pet.gender} | Weight: ${pet.weight || 'Not recorded'} kg
- Health Status: ${pet.healthStatus || 'Unknown'}
- Microchip: ${pet.microchipId || 'Not microchipped'}
- Color: ${pet.color || 'Not specified'}

**Recent Medical History:**
${healthRecords.length > 0 ?
        healthRecords.map(record =>
          `• ${record.date.toDateString()}: ${record.type} - ${record.title || record.description}${record.notes ? ` (Notes: ${record.notes})` : ''}`
        ).join('\n') :
        '• No recent medical records on file'
      }

**Current Medications:**
${medications.length > 0 ?
        medications.map(med =>
          `• ${med.name}: ${med.dosage} - ${med.frequency}${med.instructions ? ` (${med.instructions})` : ''}`
        ).join('\n') :
        '• No current medications'
      }

**Emergency Contact:** Owner should be contacted for any urgent concerns.`;
  }

  async checkSymptoms(userId: string, symptomCheckDto: SymptomCheckDto) {
    const [user, pet] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.prisma.pet.findUnique({ where: { id: symptomCheckDto.petId } }),
    ]);

    if (!pet) {
      throw new NotFoundException(`Pet with ID '${symptomCheckDto.petId}' does not exist`);
    }
    if (pet.ownerId !== userId) {
      throw new NotFoundException(`You don't have permission to access pet '${pet.name}' (ID: ${symptomCheckDto.petId}). This pet belongs to another user.`);
    }

    const [healthRecords, medications] = await Promise.all([
      this.prisma.healthRecord.findMany({
        where: { petId: symptomCheckDto.petId, isActive: true },
        orderBy: { date: 'desc' },
        take: 10,
      }),
      this.prisma.medication.findMany({
        where: { petId: symptomCheckDto.petId, isActive: true, isCompleted: false },
      }),
    ]);

    const petContext = this.buildPetContext(user, pet, healthRecords, medications);
    const aiResponse = await this.callMistralAI(petContext, symptomCheckDto);

    await this.prisma.symptomCheck.create({
      data: {
        userId,
        petId: symptomCheckDto.petId,
        petName: pet.name,
        symptoms: symptomCheckDto.symptoms,
        duration: symptomCheckDto.duration,
        severity: symptomCheckDto.severity.toString(),
        additionalInfo: symptomCheckDto.additionalInfo,
        urgencyLevel: aiResponse.urgencyLevel,
        possibleConditions: aiResponse.possibleConditions,
        recommendations: aiResponse.recommendations,
        vetRequired: aiResponse.vetRequired,
        warningSignsToWatch: aiResponse.warningSignsToWatch,
        personalizedMessage: aiResponse.personalizedMessage,
      },
    });

    return {
      petInfo: {
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        age: pet.age,
      },
      analysis: aiResponse,
      timestamp: new Date(),
    };
  }

  private buildPetContext(user: any, pet: any, healthRecords: any[], medications: any[]): string {
    return `
Owner Information:
- Name: ${user?.firstName} ${user?.lastName}
- Email: ${user?.email}

Pet Information:
- Name: ${pet.name}
- Species: ${pet.species}
- Breed: ${pet.breed}
- Age: ${pet.age} years
- Gender: ${pet.gender}
- Weight: ${pet.weight || 'Not specified'} kg
- Current Health Status: ${pet.healthStatus}

Recent Medical History (Last 10 records):
${healthRecords.length > 0 ? healthRecords.map(record =>
      `- ${record.date.toDateString()}: ${record.type} - ${record.description}${record.notes ? ` (${record.notes})` : ''}`
    ).join('\n') : 'No recent medical records'}

Current Medications:
${medications.length > 0 ?
        medications.map(med =>
          `- ${med.name}: ${med.dosage} ${med.frequency} (${med.instructions})`
        ).join('\n') :
        'No current medications'
      }`;
  }

  private async callMistralAI(petContext: string, symptomCheckDto: SymptomCheckDto): Promise<any> {
    const prompt = `You are Dr. Woofson, a friendly and expert veterinary AI assistant. You have access to the owner's information and should address them by name when appropriate. Analyze these symptoms for a detailed professional assessment.

${petContext}

Current Symptoms:
- Symptoms: ${symptomCheckDto.symptoms.join(', ')}
- Duration: ${symptomCheckDto.duration}
- Severity: ${symptomCheckDto.severity}/4
- Additional Info: ${symptomCheckDto.additionalInfo || 'None'}

Provide a comprehensive veterinary analysis with:
1. Urgency level: Emergency, Urgent, Monitor, or Normal
2. 3-5 most likely conditions with brief explanations
3. Specific immediate care recommendations
4. Whether veterinary consultation is needed (true/false)
5. Specific warning signs to monitor
6. A personalized message addressing the owner by name

Respond ONLY with valid JSON in this exact format:
{
  "urgencyLevel": "Monitor",
  "possibleConditions": ["Condition 1: explanation", "Condition 2: explanation"],
  "recommendations": ["Specific action 1", "Specific action 2"],
  "vetRequired": true,
  "warningSignsToWatch": ["Sign 1", "Sign 2"],
  "personalizedMessage": "Hello [Owner Name], based on [Pet Name]'s symptoms..."
}`;

    try {
      if (!process.env.MISTRAL_API_KEY) {
        throw new Error('Mistral API key not configured');
      }

      const response = await fetch(`${process.env.MISTRAL_API_BASE || 'https://api.mistral.ai'}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'mistral-large-latest',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.2,
          max_tokens: 1500,
        }),
      });

      if (!response.ok) {
        throw new Error(`Mistral API error: ${response.status}`);
      }

      const data = await response.json();
      const aiContent = data.choices[0].message.content;

      try {
        return JSON.parse(aiContent);
      } catch {
        return {
          urgencyLevel: 'Monitor',
          possibleConditions: [
            'Multiple symptoms present: ' + symptomCheckDto.symptoms.join(', '),
            'Possible allergic reaction or environmental irritant',
            'Stress-related symptoms from environmental changes',
          ],
          recommendations: [
            'Monitor symptoms closely for 24-48 hours',
            'Ensure fresh water is always available',
            'Remove potential allergens from environment',
            'Keep a symptom diary with times and triggers',
          ],
          vetRequired: true,
          warningSignsToWatch: [
            'Worsening of any current symptoms',
            'Loss of appetite or refusal to eat',
            'Lethargy or unusual behavior changes',
            'Difficulty breathing or excessive panting',
          ],
        };
      }
    } catch {
      const hasRespiratorySymptoms = symptomCheckDto.symptoms.some(s =>
        s.toLowerCase().includes('wheezing') || s.toLowerCase().includes('cough') || s.toLowerCase().includes('breathing'),
      );
      const hasDigestiveSymptoms = symptomCheckDto.symptoms.some(s =>
        s.toLowerCase().includes('vomit') || s.toLowerCase().includes('diarrhea'),
      );
      const hasSkinSymptoms = symptomCheckDto.symptoms.some(s =>
        s.toLowerCase().includes('itch') || s.toLowerCase().includes('scratch') || s.toLowerCase().includes('rash'),
      );

      return {
        urgencyLevel: symptomCheckDto.severity >= 3 ? 'Urgent' : 'Monitor',
        possibleConditions: [
          hasRespiratorySymptoms ? 'Respiratory irritation or allergic reaction' : 'Multiple symptom presentation',
          hasDigestiveSymptoms ? 'Gastrointestinal upset or dietary sensitivity' : 'Possible environmental stressor',
          hasSkinSymptoms ? 'Allergic dermatitis or contact irritation' : 'Stress-related behavioral changes',
          'Multi-system involvement requiring professional evaluation',
        ],
        recommendations: [
          'Schedule veterinary examination within 24-48 hours',
          'Monitor eating, drinking, and elimination habits',
          'Remove potential allergens from environment',
          'Keep detailed symptom log with timestamps',
        ],
        vetRequired: true,
        warningSignsToWatch: [
          'Worsening symptoms or new symptoms appearing',
          'Loss of appetite lasting more than 12 hours',
          'Difficulty breathing or excessive panting',
          'Lethargy or unresponsiveness',
        ],
      };
    }
  }

  async getHistory(userId: string) {
    return this.prisma.symptomCheck.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });
  }

  async chatWithAI(userId: string, message: string): Promise<string> {
    try {
      const petContext = await this.extractPetContext(userId, message);

      const systemPrompt = `You are Dr. Woofson, a friendly and knowledgeable AI veterinarian assistant. You help pet owners with:
- General pet health questions
- Symptom assessment and advice
- Preventive care guidance
- Emergency situation recognition

Always be helpful, empathetic, and professional. If symptoms seem serious, recommend veterinary consultation.

${petContext ? `\n\nUser's Pet Information:\n${petContext}` : ''}`;

      const response = await fetch(`${process.env.MISTRAL_API_BASE || 'https://api.mistral.ai'}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'mistral-large-latest',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`Mistral API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch {
      return "Hello! I'm Dr. Woofson. I'm here to help with your pet's health questions. What would you like to know about your furry friend?";
    }
  }
}