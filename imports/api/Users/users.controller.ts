import { ResponseMessage } from '@server/utils/ResponseMessage';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import Permissions from '../../startup/server/Permissions';
import { SaveUserRequestDto } from './dtos/save-user-request.dto';
import { UserDeleteRequestDto } from './dtos/user-delete-request.dto';
import { UserUpdatePersonalDataRequestDto } from './dtos/user-update-personal-data-request.dto';
import { UserService } from './users.service';
import { BaseController } from '/imports/common/controllers/base.controller';
import { Auth } from '/imports/common/decorators/auth-guard.decorator';
import { Controller } from '/imports/common/decorators/controller.decorator';
import { Method } from '/imports/common/decorators/method.decorator';
import { CheckPermissions } from '/imports/common/decorators/permissions.decorator';
import { Validate } from '/imports/common/decorators/validate.decorator';

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
		if (loginTokensOfUser.length > 1) {
			await Meteor.users.updateAsync(loginAttempt.user._id, {
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
	async saveUser(usersRequestDto: SaveUserRequestDto) {
		const { user } = usersRequestDto;

		await this.userService.validateEmail(user.emails[0].address, user._id);
		await this.userService.validateUsername(user.username, user._id);
		await this.userService.validateProfile(user.profile.profile);

		return this.userService.saveUser(usersRequestDto);
	}

	@Method('user.delete')
	@CheckPermissions(Permissions.USERS.DELETE.VALUE)
	@Validate(UserDeleteRequestDto)
	async deleteUser(requestDto: UserDeleteRequestDto) {
		const responseMessage = new ResponseMessage();
		await this.userService.deleteUser(requestDto.userId);
		responseMessage.create('User removed successfully!');
		return responseMessage;
	}

	@Method('user.updatePersonalData')
	@Auth()
	@Validate(UserUpdatePersonalDataRequestDto)
	async updatePersonalData(requestDto: UserUpdatePersonalDataRequestDto) {
		const responseMessage = new ResponseMessage();
		const { user } = requestDto;

		await this.userService.validateEmail(user.emails[0].address, this.__context.userId);
		await this.userService.validateUsername(user.username, this.__context.userId);

		requestDto.user._id = this.__context.userId;
		await this.userService.updatePersonalData(requestDto);
		responseMessage.create('Information updated!');
		return responseMessage;
	}
}

