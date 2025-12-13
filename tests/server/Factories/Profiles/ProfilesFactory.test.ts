import * as faker from 'faker';
import { Factory } from 'meteor/dburles:factory';
import { permissionsArray } from '../../../../imports/api/Permissions/helpers/permissions.helpers';
import { Profile } from '/imports/api/Profiles/profile.entity';

Factory.define('profile', Profile.collection, {
	name: () => faker.name.jobDescriptor(),
	description: () => faker.name.title(),
	permissions: () => faker.random.arrayElements(permissionsArray.map(p => p.VALUE))
});