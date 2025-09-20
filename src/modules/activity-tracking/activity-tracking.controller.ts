import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActivityTrackingService } from './activity-tracking.service';
import { CreateActivityDto } from './dto/create-activity.dto';

@ApiTags('Activity Tracking')
@ApiBearerAuth('JWT-auth')
@Controller('activity-tracking')
@UseGuards(JwtAuthGuard)
export class ActivityTrackingController {
  constructor(private readonly activityTrackingService: ActivityTrackingService) {}

  @ApiOperation({ 
    summary: 'Log a new pet activity',
    description: `
      Record a new activity for your pet such as walks, feeding, playtime, or water intake.
      
      **Activity Types:**
      - **walk**: Record walks with duration and distance
      - **play**: Log playtime and exercise sessions
      - **feeding**: Track meal times and food amounts
      - **water**: Monitor water intake
      - **exercise**: Record other exercise activities
      - **other**: Any other custom activity
      
      **Tips:**
      - For walks: Include duration (minutes) and distance (km)
      - For feeding: Specify food amount in grams
      - For water: Record amount in milliliters
      - Add notes for additional context
    `
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Activity logged successfully',
    schema: {
      example: {
        _id: '507f1f77bcf86cd799439011',
        petId: '507f1f77bcf86cd799439012',
        type: 'walk',
        date: '2024-01-15T10:30:00.000Z',
        duration: 30,
        distance: 2.5,
        notes: 'Morning walk in the park',
        isActive: true,
        createdAt: '2024-01-15T10:35:00.000Z',
        updatedAt: '2024-01-15T10:35:00.000Z'
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Validation failed - Invalid activity data provided',
    schema: {
      example: {
        success: false,
        statusCode: 400,
        message: 'Validation failed for the provided data',
        details: [
          {
            property: 'type',
            value: 'invalid_type',
            constraints: {
              isEnum: 'type must be one of the following values: walk, play, feeding, water, exercise, other'
            }
          }
        ],
        suggestions: [
          'Use valid activity types: walk, play, feeding, water, exercise, other',
          'Ensure all required fields (petId, type, date) are provided'
        ]
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing JWT token',
    schema: {
      example: {
        success: false,
        statusCode: 401,
        message: 'Unauthorized',
        suggestions: [
          'Make sure you are logged in and have a valid JWT token',
          'Check if your token has expired and refresh if needed'
        ]
      }
    }
  })
  @Post()
  async create(@Request() req, @Body() createActivityDto: CreateActivityDto) {
    const userId = req.user._id || req.user.id;
    return this.activityTrackingService.create(createActivityDto, userId);
  }

  @ApiOperation({ 
    summary: 'Get all activities for a specific pet',
    description: `
      Retrieve all recorded activities for a pet, optionally filtered by activity type.
      Activities are returned in reverse chronological order (newest first).
      
      **Filter Options:**
      - No filter: Returns all activities
      - Type filter: Returns only activities of specified type
      
      **Common Use Cases:**
      - View all pet activities for health monitoring
      - Track specific activity types (e.g., only walks)
      - Generate activity reports and analytics
    `
  })
  @ApiParam({
    name: 'petId',
    description: 'Unique identifier of the pet',
    example: '507f1f77bcf86cd799439012'
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Filter activities by type',
    enum: ['walk', 'play', 'feeding', 'water', 'exercise', 'other'],
    example: 'walk'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of pet activities retrieved successfully',
    schema: {
      example: [
        {
          _id: '507f1f77bcf86cd799439011',
          petId: '507f1f77bcf86cd799439012',
          type: 'walk',
          date: '2024-01-15T10:30:00.000Z',
          duration: 30,
          distance: 2.5,
          notes: 'Morning walk in the park'
        },
        {
          _id: '507f1f77bcf86cd799439013',
          petId: '507f1f77bcf86cd799439012',
          type: 'feeding',
          date: '2024-01-15T08:00:00.000Z',
          foodAmount: 200,
          notes: 'Breakfast - dry kibble'
        }
      ]
    }
  })
  @Get('pet/:petId')
  async findByPet(@Param('petId') petId: string, @Query('type') type?: string) {
    return this.activityTrackingService.findByPet(petId, type);
  }

  @ApiOperation({ 
    summary: 'Get daily activity statistics for a pet',
    description: `
      Get comprehensive daily statistics for a pet's activities on a specific date.
      
      **Statistics Include:**
      - Total number of walks
      - Total distance walked (km)
      - Number of feeding sessions
      - Total food consumed (grams)
      - Total water intake (ml)
      - List of all activities for the day
      
      **Use Cases:**
      - Daily health monitoring
      - Activity trend analysis
      - Veterinary reporting
      - Pet care insights
    `
  })
  @ApiParam({
    name: 'petId',
    description: 'Unique identifier of the pet',
    example: '507f1f77bcf86cd799439012'
  })
  @ApiQuery({
    name: 'date',
    description: 'Date for statistics (YYYY-MM-DD format)',
    example: '2024-01-15'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Daily statistics retrieved successfully',
    schema: {
      example: {
        totalWalks: 2,
        totalDistance: 4.5,
        totalFeedings: 3,
        totalFoodAmount: 600,
        totalWaterIntake: 500,
        activities: [
          {
            _id: '507f1f77bcf86cd799439011',
            type: 'walk',
            date: '2024-01-15T10:30:00.000Z',
            duration: 30,
            distance: 2.5
          }
        ]
      }
    }
  })
  @Get('pet/:petId/daily-stats')
  async getDailyStats(@Param('petId') petId: string, @Query('date') date: string) {
    return this.activityTrackingService.getDailyStats(petId, date);
  }

  @ApiOperation({ 
    summary: 'Delete an activity record',
    description: `
      Soft delete an activity record. The activity will be marked as inactive but not permanently removed.
      
      **Important Notes:**
      - This is a soft delete operation
      - Activity data is preserved for historical records
      - Only the activity owner can delete their records
      - Deleted activities won't appear in future queries
    `
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the activity to delete',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Activity deleted successfully',
    schema: {
      example: {
        _id: '507f1f77bcf86cd799439011',
        petId: '507f1f77bcf86cd799439012',
        type: 'walk',
        isActive: false,
        updatedAt: '2024-01-15T11:00:00.000Z'
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Activity not found',
    schema: {
      example: {
        success: false,
        statusCode: 404,
        message: "Activity with ID '507f1f77bcf86cd799439011' not found",
        suggestions: [
          'Check if the activity ID is correct',
          'Verify the activity exists and you have access to it'
        ]
      }
    }
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.activityTrackingService.delete(id);
  }
}