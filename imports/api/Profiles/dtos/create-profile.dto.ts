import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SaveProfileDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  _id?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  permissions: string[];
} 