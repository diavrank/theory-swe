import { Mongo } from 'meteor/mongo';
import { type Profile } from './profile.entity';

export const ProfileCollection = new Mongo.Collection<Profile>('profiles');
