import { Roles } from 'meteor/alanning:roles';

export interface RoleType extends Roles.Role{
	_id: string;
	name: string;
	children: Array<object>;
	publicName: string;
	scope?: string;
}
