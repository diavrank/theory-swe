import { Meteor } from 'meteor/meteor';
import { Auth, BasePublication, Publication } from 'meteorjs-decorators';

@Publication('roles')
export class PermissionsPublication extends BasePublication {

	@Auth()
	init() {
		//TODO: Change to role.repository
		return Meteor.roleAssignment.find({ 'user._id': this.__context.userId });
	}
}
