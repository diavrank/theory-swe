import { ProfileResponseDto } from './dtos/profile-response.dto';
import { ProfileRepository } from './profile.repository';
import { ProfilesService } from './profiles.service';
import { Auth } from '/imports/common/decorators/auth-guard.decorator';
import { Publication } from "/imports/common/decorators/publication.decorator";
import { ReactiveDto } from '/imports/common/decorators/reactive-dto.decorator';
import { BasePublication } from "/imports/common/publications/base.publication";

/**
 * @summary List all non static profiles
 * @publication profiles
 *
 */
@Publication('profiles')
export class ProfilesPublication extends BasePublication {
	constructor(
		private readonly profileRepository: ProfileRepository = new ProfileRepository(),
		private readonly profilesService: ProfilesService = new ProfilesService(null as any)
	) {
		super();
	}

	@Auth()
	@ReactiveDto(ProfileResponseDto)
	init() {
		return this.profileRepository.findAll({ name: { $nin: this.profilesService.getStaticProfileNames() } });
	}
}

