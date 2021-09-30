import { Roles } from 'meteor/alanning:roles';

export interface RoleType extends Roles.Role{
	_id: string,
	children: Array<Object>,
	publicName: string
}
