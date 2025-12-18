import faker from 'faker';
import { Factory } from 'meteor/dburles:factory';
import { StaticProfiles } from '/imports/api/Profiles/constants/static-profiles.constant';
import { User } from '/imports/api/Users/user.entity';

Factory.define('user', User.collection, {
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

Factory.define('simpleUser', User.collection, {
	username: () => faker.internet.userName(),
	profile: {
		name: () => faker.name.findName(),
		profile: () => StaticProfiles.admin.name
	},
	email: () => faker.internet.email()
});
