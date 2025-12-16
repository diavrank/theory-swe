import { Meteor } from 'meteor/meteor';
import { Auth } from '/imports/common/decorators/auth-guard.decorator';
import { Publication } from '/imports/common/decorators/publication.decorator';
import { BasePublication } from '/imports/common/publications/base.publication';

@Publication('roles')
export class PermissionsPublication extends BasePublication {

	@Auth()
	init() {
		//TODO: Change to role.repository
		return Meteor.roleAssignment.find({ 'user._id': this.__context.userId });
	}
}
