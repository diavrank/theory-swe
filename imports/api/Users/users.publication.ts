import { ProfilesService } from '../Profiles/profiles.service';
import { UserResponseDto } from './dtos/user-response.dto';
import { UserRepository } from './user.repository';
import { Auth } from '/imports/common/decorators/auth-guard.decorator';
import { Publication } from '/imports/common/decorators/publication.decorator';
import { ReactiveDto } from '/imports/common/decorators/reactive-dto.decorator';
import { BasePublication } from '/imports/common/publications/base.publication';

// TODO: Add decorator to check authentication
@Publication('users')
export class UsersPublication extends BasePublication {
	constructor(
		private readonly userRepository: UserRepository = new UserRepository(),
		private readonly profilesService: ProfilesService = new ProfilesService(null as any)
	) {
		super();
	}

	@Auth()
	@ReactiveDto(UserResponseDto)
	init() {
		const selector = { 'profile.profile': { $nin: this.profilesService.getStaticProfilesForExternalUsers() } };
		// TODO: Add server side pagination
		return this.userRepository.findAll(selector, {
			fields: {
				username: 1,
				emails: 1,
				createdAt: 1,
				profile: 1,
				status: 1,
			},
		});
	}
}
