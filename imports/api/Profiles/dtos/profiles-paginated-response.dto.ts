import { type Profile } from '../profile.entity';
import { ProfileResponseDto } from './profile-response.dto';
import { ResponseDto } from 'meteorjs-decorators';

export class ProfilesPaginatedResponseDto extends ResponseDto {
  data: ProfileResponseDto[];
  total: number;

  build(response: { profiles: Profile[]; total: number }): ProfilesPaginatedResponseDto {
    this.data = response.profiles.map(profile => new ProfileResponseDto().build(profile));
    this.total = response.total;

    return this.send();
  }
}
