import { AstronomyEvent, Class } from 'meteor/jagi:astronomy';
import { ProfileCollection, ProfileType } from '/imports/api/Profiles/ProfileCollection';

export const Profile = Class.create<ProfileType>({
	name: 'Profile',
	collection: ProfileCollection,
	fields: {
		name: String,
		description: String,
		permissions: [String]
	},
	indexes: {
		name: {
			fields: { name: 1 },
			options: { unique: true }
		}
	},
	helpers: {
		getPermissions() {
			return Meteor.roles.find({ _id: { $in: this.permissions } });
		},
		getPermissionsComplement() {
			return Meteor.roles.find({ _id: { $not: { $in: this.permissions } } });
		}
	},
	events: {
		afterUpdate(event: AstronomyEvent<ProfileType>) {
			if (event.oldDoc.name !== event.doc.name) {
				Meteor.users.update({ 'profile.profile': event.oldDoc.name }, {
					$set: {
						'profile.profile': event.doc.name
					}
				}, { multi: true });
			}
			const users = Meteor.users.find({ 'profile.profile': event.doc.name }, { fields: { _id: 1 } }).fetch();
			const userIds = users.map(user => user._id);
			// @ts-ignore
			Meteor.roleAssignment.remove({ 'user._id': { $in: userIds } });
			Roles.setUserRoles(userIds, event.currentTarget.permissions, event.currentTarget.name);
		}
	}
});
