import { RoleType } from '/imports/api/Permissions/Permission';

interface Email {
	address?: string;
	verified: boolean;
}

interface Profile {
	_id?: string;
	profile?: string;
	name?: string;
	path?: string;
	description?: string;
	permissions?: RoleType[]
}

interface User {
	_id?: string;
	username?: string;
	emails: Email[];
	profile: Profile;
	photoFileUser?: any;
}

export {
	User,
	Profile
};
