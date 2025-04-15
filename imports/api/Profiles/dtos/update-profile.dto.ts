import { IsArray, IsOptional, IsString } from 'class-validator';

class BaseProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  permissions?: string[];
}

export class UpdateProfileDto extends BaseProfileDto {
  @IsString()
  _id: string;
} 