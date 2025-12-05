import { ProfilesService } from '../Profiles/profiles.service';
import { UserResponseDto } from './dtos/user-response.dto';
import { UserRepository } from './user.repository';
import { Publication } from '/imports/common/decorators/publication.decorator';
import { PublishDto } from '/imports/common/decorators/publish-dto.decorator';
import { BasePublication } from '/imports/common/publications/base.publication';

@Publication('users')
@PublishDto(UserResponseDto)
export class UsersPublication extends BasePublication {
	constructor(
		private readonly userRepository: UserRepository = new UserRepository(),
		private readonly profilesService: ProfilesService = new ProfilesService(null as any) // UserService not needed for getStaticProfilesForExternalUsers()
	) {
		super();
	}

	init() {
		const selector = { 'profile.profile': { $nin: this.profilesService.getStaticProfilesForExternalUsers() } };
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