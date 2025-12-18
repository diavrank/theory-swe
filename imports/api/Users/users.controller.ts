import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import Permissions from '../Permissions/helpers/permissions.helpers';
import { SaveUserRequestDto } from './dtos/save-user-request.dto';
import { UserDeleteRequestDto } from './dtos/user-delete-request.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { User } from './user.entity';
import './UserPresenceConfig';
import { UserService } from './users.service';
import { BaseController } from '/imports/common/controllers/base.controller';
import { Auth } from '/imports/common/decorators/auth-guard.decorator';
import { Controller } from '/imports/common/decorators/controller.decorator';
import { Dto } from '/imports/common/decorators/dto.decorator';
import { Method } from '/imports/common/decorators/method.decorator';
import { CheckPermissions } from '/imports/common/decorators/permissions.decorator';
import { Validate } from '/imports/common/decorators/validate.decorator';
import { DeleteResponse } from '/imports/common/dtos/delete-response.dto';

// TODO: Maybe these listeners should be moved to auth.module 
Accounts.onCreateUser((options: any, user: Meteor.User) => {
	//Configuration for user-status
	const customizedUser = Object.assign({
		status: {
			online: false
		}
	}, user);
	// We still want the default hook's 'profile' behavior.
	if (options.profile) {
		customizedUser.profile = options.profile;
	}
	return customizedUser;
});

Accounts.validateLoginAttempt(async (loginAttempt: any) => {
	if (loginAttempt.allowed) {
		if (!loginAttempt.user.emails[0].verified) {
			throw new Meteor.Error('403', 'The account email has not been verified yet.');
		}
		const loginTokensOfUser: string[] = loginAttempt.user.services.resume?.loginTokens || [];
		// Allow only up to 3 simultaneus tokens with the same user.
		if (loginTokensOfUser.length > 3) {
			await User.collection.updateAsync(loginAttempt.user._id, {
				$set: {
					'services.resume.loginTokens': [loginTokensOfUser.pop()]
				}
			});
		}
		return true;
	}
});

@Controller()
export class UsersController extends BaseController {

	constructor(private readonly userService: UserService) {
		super();
	}

	@Method('user.save')
	@CheckPermissions(Permissions.USERS.CREATE.VALUE, Permissions.USERS.UPDATE.VALUE)
	@Validate(SaveUserRequestDto)
	@Dto(UserResponseDto)
	async saveUser(usersRequestDto: SaveUserRequestDto) {
		const { user } = usersRequestDto;

		await this.userService.validateEmail(user.email, user.id);
		await this.userService.validateUsername(user.username, user.id);
		await this.userService.validateProfile(user.profile.profile);

		return this.userService.saveUser(usersRequestDto);
	}

	@Method('user.delete')
	@CheckPermissions(Permissions.USERS.DELETE.VALUE)
	@Validate(UserDeleteRequestDto)
	@Dto(DeleteResponse)
	async deleteUser(requestDto: UserDeleteRequestDto) {
		await this.userService.deleteUser(requestDto.userId);
	}

	@Method('user.updatePersonalData')
	@Auth()
	@Validate(SaveUserRequestDto)
	@Dto(UserResponseDto)
	async updatePersonalData(requestDto: SaveUserRequestDto) {
		const { user } = requestDto;

		await this.userService.validateEmail(user.email, this.__context.userId);
		await this.userService.validateUsername(user.username, this.__context.userId);

		requestDto.user.id = this.__context.userId;

		return this.userService.saveUser(requestDto);
	}

	@Method('users.getTotal')
	@CheckPermissions(Permissions.USERS.LIST.VALUE)
	getUsersTotal(request?: { search?: string }) {
		return this.userService.getUsersTotal(this.__context.userId, request?.search);
	}
}
