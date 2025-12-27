import { Mongo } from 'meteor/mongo';
import { Auth, BasePublication, Publication, ReactiveDto, Validate } from 'meteorjs-decorators';
import { ProfilesService } from '../Profiles/profiles.service';
import { UserPublicationResponseDto } from './dtos/user-publication-response.dto';
import { UsersRequestDto } from './dtos/users-request.dto';
import { type User } from './user.entity';
import { UserRepository } from './user.repository';


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
	@Validate(UsersRequestDto)
	@ReactiveDto(UserPublicationResponseDto)
	init(request: UsersRequestDto = new UsersRequestDto()) {
		const selector: Mongo.Selector<User> = {
			_id: { $ne: this.__context.userId || undefined },
			'profile.profile': { $nin: this.profilesService.getStaticProfilesForExternalUsers() },
		};
		const searchTerm = request.search?.trim();
		if (searchTerm) {
			selector.$text = { $search: searchTerm };
		}

		const pageNumber = Math.max(1, Number(request.page) || 1);
		const pageSize = Math.min(Math.max(Number(request.limit) || 1, 1), 100);
		return this.userRepository.findAll(selector, {
			fields: {
				username: 1,
				emails: 1,
				createdAt: 1,
				profile: 1,
				status: 1,
			},
			limit: pageSize,
			skip: (pageNumber - 1) * pageSize,
			sort: { 'profile.name': 1 },
		});
	}
}
