import { Factory } from 'meteor/dburles:factory';
import { ProfileCollection } from '/imports/api/Profiles/Profile';
import * as faker from 'faker';
import { permissionsArray } from '/imports/startup/server/Permissions';

Factory.define('profile', ProfileCollection, {
	name: () => faker.name.jobDescriptor(),
	description: () => faker.name.title(),
	permissions: () => faker.random.arrayElements(permissionsArray.map(p => p.VALUE))
});
