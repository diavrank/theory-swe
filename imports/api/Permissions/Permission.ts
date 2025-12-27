import { Roles } from 'meteor/alanning:roles';

export interface RoleType extends Roles.Role {
	_id: string;
	// TODO: Currently set to empty array always. Refactor roles data model.
	children: Array<{ _id: string }>;
	publicName: string;
	scope?: string;
}
