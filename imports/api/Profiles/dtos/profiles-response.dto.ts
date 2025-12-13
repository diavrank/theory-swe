import { Profile } from '../profile.entity';
import { ProfileResponseDto } from './profile-response.dto';
import { ResponseDto } from '/imports/common/dtos/response.dto';

export class ProfilesResponseDto extends ResponseDto {
    data: ProfileResponseDto[];

    build(profiles: Profile[]): ProfilesResponseDto {
        this.data = profiles.map(profile => new ProfileResponseDto().build(profile));

        return this.send();
    }
}
