import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum, Min, Max } from 'class-validator';

export class CreatePetDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['dog', 'cat', 'bird', 'rabbit', 'hamster', 'fish', 'reptile', 'other'])
  species: string;

  @IsString()
  @IsNotEmpty()
  breed: string;

  @IsNumber()
  @Min(0)
  @Max(30)
  age: number;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['male', 'female'])
  gender: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  microchipId?: string;

  @IsOptional()
  @IsString()
  profileImage?: string;
}