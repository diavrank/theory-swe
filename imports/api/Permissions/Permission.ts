export interface RoleType {
	_id: string,
	children: Array<RoleType>,
	publicName: string
}