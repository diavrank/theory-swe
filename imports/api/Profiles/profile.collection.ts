import { Mongo } from 'meteor/mongo';
import { type ProfileResponseDto } from './dtos/profile-response.dto';

export const ProfileCollection = new Mongo.Collection<ProfileResponseDto>('profiles');
