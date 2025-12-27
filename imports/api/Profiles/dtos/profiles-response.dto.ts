import { type Profile } from '../profile.entity';
import { ProfileResponseDto } from './profile-response.dto';
import { ResponseDto } from 'meteorjs-decorators';

export class ProfilesResponseDto extends ResponseDto {
    data: ProfileResponseDto[];

    build(profiles: Profile[]): ProfilesResponseDto {
        this.data = profiles.map(profile => new ProfileResponseDto().build(profile));

        return this.send();
    }
}
