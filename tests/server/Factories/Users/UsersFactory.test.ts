import faker from 'faker';
import { Factory } from 'meteor/dburles:factory';
import { Meteor } from 'meteor/meteor';
import { StaticProfiles } from '/imports/api/Profiles/constants/static-profiles.constant';

Factory.define('user', Meteor.users, {
	username: () => faker.internet.userName(),
	profile: {
		name: () => faker.name.findName(),
		profile: () => StaticProfiles.admin.name
	},
	services: {
		password: {
			bcrypt: () => faker.internet.password()
		},
		resume: {
			loginTokens: () => []
		}
	},
	email: () => faker.internet.email(),
	createdAt: () => new Date(),
	status: {
		online: () => false
	}
});

Factory.define('simpleUser', Meteor.users, {
	username: () => faker.internet.userName(),
	profile: {
		name: () => faker.name.findName(),
		profile: () => StaticProfiles.admin.name
	},
	email: () => faker.internet.email()
});
