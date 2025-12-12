import faker from 'faker';
import { Factory } from 'meteor/dburles:factory';
import { Meteor } from 'meteor/meteor';
import { StaticProfiles } from '../../../../imports/backfills/recurring/RefreshStaticProfilesBackfill';

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
	emails: () => [{ address: faker.internet.email(), verified: true }],
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
	emails: () => [{ address: faker.internet.email(), verified: true }]
});
