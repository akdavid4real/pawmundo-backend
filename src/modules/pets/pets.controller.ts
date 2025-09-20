import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@ApiTags('Pets')
@ApiBearerAuth('JWT-auth')
@Controller('pets')
@UseGuards(JwtAuthGuard)
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @ApiOperation({ 
    summary: 'Create a new pet profile',
    description: `
      Create a comprehensive pet profile with detailed information including:
      
      **Basic Information:**
      - Name, species, breed, age, gender
      - Physical characteristics (weight, color)
      - Date of birth
      
      **Medical Information:**
      - Known allergies
      - Past illnesses and surgeries
      - Medical notes
      
      **Dietary & Behavioral:**
      - Dietary preferences and restrictions
      - Behavioral notes and quirks
      
      **Emergency Information:**
      - Emergency contact details
      - Microchip ID
      
      **Tips:**
      - All fields except name, species, breed, age, and gender are optional
      - Use arrays for multiple allergies, illnesses, or restrictions
      - Include detailed behavioral notes for better pet care
    `
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Pet profile created successfully',
    schema: {
      example: {
        _id: '507f1f77bcf86cd799439012',
        name: 'Buddy',
        species: 'dog',
        breed: 'Golden Retriever',
        age: 3,
        gender: 'male',
        weight: 30.5,
        color: 'Golden',
        allergies: ['chicken', 'wheat'],
        dietaryPreferences: 'Grain-free diet',
        behavioralNotes: 'Very friendly, loves playing fetch',
        ownerId: '507f1f77bcf86cd799439010',
        healthStatus: 'healthy',
        isActive: true,
        createdAt: '2024-01-15T10:00:00.000Z'
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Validation failed - Invalid pet data',
    schema: {
      example: {
        success: false,
        statusCode: 400,
        message: 'Validation failed for the provided data',
        details: [
          {
            property: 'age',
            value: -1,
            constraints: {
              min: 'age must not be less than 0'
            }
          }
        ],
        suggestions: [
          'Ensure age is between 0 and 30 years',
          'Check all required fields are provided correctly'
        ]
      }
    }
  })
  @Post()
  async create(@Request() req, @Body() createPetDto: CreatePetDto) {
    const userId = req.user._id || req.user.id;
    const petData = {
      ...createPetDto,
      ownerId: userId,
      dateOfBirth: createPetDto.dateOfBirth ? new Date(createPetDto.dateOfBirth) : undefined
    };
    return this.petsService.create(petData);
  }

  @ApiOperation({ 
    summary: 'Get all pets owned by the current user',
    description: `
      Retrieve all pets belonging to the authenticated user, with optional filtering by species.
      
      **Features:**
      - Returns only active pets (not deleted)
      - Sorted alphabetically by pet name
      - Optional species filtering
      - Includes complete pet profile information
      
      **Common Species:**
      - dog, cat, bird, rabbit, hamster, fish, reptile, other
    `
  })
  @ApiQuery({ 
    name: 'species', 
    required: false, 
    description: 'Filter pets by species (e.g., dog, cat, bird)',
    example: 'dog'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of user pets retrieved successfully',
    schema: {
      example: [
        {
          _id: '507f1f77bcf86cd799439012',
          name: 'Buddy',
          species: 'dog',
          breed: 'Golden Retriever',
          age: 3,
          healthStatus: 'healthy',
          profileImage: 'https://example.com/buddy.jpg'
        },
        {
          _id: '507f1f77bcf86cd799439013',
          name: 'Whiskers',
          species: 'cat',
          breed: 'Persian',
          age: 2,
          healthStatus: 'healthy'
        }
      ]
    }
  })
  @Get()
  async findMyPets(@Request() req, @Query('species') species?: string) {
    const userId = req.user._id || req.user.id;
    return this.petsService.findByOwner(userId, species);
  }

  @ApiOperation({ 
    summary: 'Get detailed information for a specific pet',
    description: `
      Retrieve complete profile information for a specific pet by ID.
      
      **Security:**
      - Users can only access their own pets
      - Returns 403 Forbidden for pets owned by other users
      - Returns 404 Not Found for non-existent pets
      
      **Returned Information:**
      - Complete pet profile with all details
      - Medical history and health status
      - Dietary preferences and restrictions
      - Behavioral notes and emergency contacts
    `
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the pet',
    example: '507f1f77bcf86cd799439012'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Pet details retrieved successfully',
    schema: {
      example: {
        _id: '507f1f77bcf86cd799439012',
        name: 'Buddy',
        species: 'dog',
        breed: 'Golden Retriever',
        age: 3,
        gender: 'male',
        weight: 30.5,
        color: 'Golden',
        microchipId: 'CHIP123456789',
        allergies: ['chicken', 'wheat'],
        pastIllnesses: ['kennel cough'],
        surgeries: ['neutering'],
        dietaryPreferences: 'Grain-free diet',
        dietaryRestrictions: ['chicken', 'dairy'],
        behavioralNotes: 'Very friendly, loves playing fetch, afraid of thunderstorms',
        emergencyContactName: 'John Doe',
        emergencyContactPhone: '+1234567890',
        healthStatus: 'healthy',
        ownerId: '507f1f77bcf86cd799439010',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T10:00:00.000Z'
      }
    }
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Access denied - Pet belongs to another user',
    schema: {
      example: {
        success: false,
        statusCode: 403,
        message: 'Access denied',
        suggestions: [
          'You do not have permission to access this resource',
          'Ensure you are accessing your own pet data'
        ]
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Pet not found',
    schema: {
      example: {
        success: false,
        statusCode: 404,
        message: "Pet with ID '507f1f77bcf86cd799439012' does not exist",
        suggestions: [
          'Check if the pet ID is correct',
          'Verify the pet exists and you have access to it'
        ]
      }
    }
  })
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user._id || req.user.id;
    return this.petsService.findById(id, userId);
  }

  @ApiOperation({ summary: 'Update pet information' })
  @ApiResponse({ status: 200, description: 'Pet updated successfully' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePetDto: UpdatePetDto, @Request() req) {
    const userId = req.user._id || req.user.id;
    const petData: any = { ...updatePetDto };
    if (updatePetDto.dateOfBirth) {
      petData.dateOfBirth = new Date(updatePetDto.dateOfBirth);
    }
    return this.petsService.update(id, userId, petData);
  }

  @ApiOperation({ summary: 'Update pet health status' })
  @ApiResponse({ status: 200, description: 'Health status updated' })
  @Put(':id/health-status')
  async updateHealthStatus(@Param('id') id: string, @Body('status') status: string, @Request() req) {
    const userId = req.user._id || req.user.id;
    return this.petsService.updateHealthStatus(id, userId, status);
  }

  @ApiOperation({ summary: 'Delete pet' })
  @ApiResponse({ status: 200, description: 'Pet deleted successfully' })
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const userId = req.user._id || req.user.id;
    return this.petsService.delete(id, userId);
  }
}