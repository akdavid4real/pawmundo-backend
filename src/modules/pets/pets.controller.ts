import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@ApiTags('Pets')
@ApiBearerAuth()
@Controller('pets')
@UseGuards(JwtAuthGuard)
export class PetsController {
  constructor(private readonly petsService: PetsService) { }

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
        _id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
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
        ownerId: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
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
    const userId = req.user.userId;
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
          _id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          name: 'Buddy',
          species: 'dog',
          breed: 'Golden Retriever',
          age: 3,
          healthStatus: 'healthy',
          profileImage: 'https://example.com/buddy.jpg'
        },
        {
          _id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
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
    const userId = req.user.userId;
    console.log('🐾 Finding pets for userId:', userId);
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
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
  })
  @ApiResponse({
    status: 200,
    description: 'Pet details retrieved successfully',
    schema: {
      example: {
        _id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
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
        ownerId: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
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
        message: "Pet with ID 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' does not exist",
        suggestions: [
          'Check if the pet ID is correct',
          'Verify the pet exists and you have access to it'
        ]
      }
    }
  })
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;
    return this.petsService.findById(id, userId);
  }

  @ApiOperation({
    summary: 'Update pet information',
    description: `
      Update any field of a pet's profile. Only provided fields will be updated.
      
      **Updatable Fields:**
      - Basic info (name, breed, age, weight, color)
      - Medical info (allergies, past illnesses, surgeries)
      - Dietary info (preferences, restrictions)
      - Behavioral notes
      - Emergency contacts
      
      **Note:** You can only update your own pets
    `
  })
  @ApiParam({ name: 'id', description: 'Pet ID', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @ApiResponse({
    status: 200,
    description: 'Pet updated successfully',
    schema: {
      example: {
        _id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        name: 'Buddy Updated',
        weight: 32,
        updatedAt: '2024-01-16T10:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Pet not found' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePetDto: UpdatePetDto, @Request() req) {
    const userId = req.user.userId;
    const petData: any = { ...updatePetDto };
    if (updatePetDto.dateOfBirth) {
      petData.dateOfBirth = new Date(updatePetDto.dateOfBirth);
    }
    return this.petsService.update(id, userId, petData);
  }

  @ApiOperation({
    summary: 'Update pet health status',
    description: `
      Update the current health status of a pet.
      
      **Valid Status Values:**
      - healthy - Pet is in good health
      - sick - Pet is currently ill
      - recovering - Pet is recovering from illness
      - chronic - Pet has chronic condition
      
      **Use Cases:**
      - Track pet's health changes over time
      - Alert for sick pets needing attention
      - Monitor recovery progress
    `
  })
  @ApiParam({ name: 'id', description: 'Pet ID', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @ApiResponse({
    status: 200,
    description: 'Health status updated',
    schema: {
      example: {
        _id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        name: 'Buddy',
        healthStatus: 'sick',
        updatedAt: '2024-01-16T10:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid health status' })
  @Put(':id/health-status')
  async updateHealthStatus(@Param('id') id: string, @Body('status') status: string, @Request() req) {
    const userId = req.user.userId;
    return this.petsService.updateHealthStatus(id, userId, status);
  }

  @ApiOperation({
    summary: 'Delete pet (soft delete)',
    description: `
      Soft delete a pet profile. The pet is marked as inactive but not permanently removed.
      
      **Important:**
      - Pet data is preserved for historical records
      - Associated health records, appointments remain accessible
      - Pet will not appear in active pet lists
      - Can be restored by admin if needed
      
      **Security:** Only pet owner can delete their pets
    `
  })
  @ApiParam({ name: 'id', description: 'Pet ID to delete', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @ApiResponse({
    status: 200,
    description: 'Pet deleted successfully',
    schema: {
      example: {
        _id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        name: 'Buddy',
        isActive: false,
        updatedAt: '2024-01-16T10:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Pet not found' })
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;
    return this.petsService.delete(id, userId);
  }
}