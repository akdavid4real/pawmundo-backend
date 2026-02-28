import { validate } from 'class-validator';
import { CreateEventDto } from './create-event.dto';

describe('CreateEventDto', () => {
  let dto: CreateEventDto;

  beforeEach(() => {
    dto = new CreateEventDto();
    dto.title = 'Valid Event';
    dto.description = 'A completely valid event';
    dto.eventDate = new Date().toISOString();
    dto.category = 'appointment';
  });

  it('should validate a valid DTO successfully', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate successfully with a valid UUID for petId', async () => {
    dto.petId = 'f8546b2b-5f0a-40a2-a9b0-958b4ba3c3d5'; // Hardcoded valid UUID
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation with a MongoDB ObjectId for petId', async () => {
    dto.petId = '507f1f77bcf86cd799439011'; // Classic MongoDB ObjectId
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    const petIdError = errors.find((e) => e.property === 'petId');
    expect(petIdError).toBeDefined();
    expect(petIdError.constraints.isUuid).toBeDefined();
  });

  it('should fail validation with an arbitrary invalid string for petId', async () => {
    dto.petId = 'not-a-uuid';
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    const petIdError = errors.find((e) => e.property === 'petId');
    expect(petIdError).toBeDefined();
    expect(petIdError.constraints.isUuid).toBeDefined();
  });
});
