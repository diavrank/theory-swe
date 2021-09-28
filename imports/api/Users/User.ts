import { Meteor } from 'meteor/meteor';
// @ts-ignore
import { User } from 'meteor/socialize:user-model';
// @ts-ignore
import SimpleSchema from 'simpl-schema';

export interface UserCreation{
    username?: string;
    email?: string;
    password?: string;
    profile: any;
}

Meteor.users.allow({
    insert: () => false,
    update: () => false,
    remove: () => false
});

Meteor.users.deny({
    insert: () => true,
    update: () => true,
    remove: () => true
});

Meteor.users.rawCollection().createIndex({ 'profile.profile': 1 });

const UserProfileSchema = new SimpleSchema({
    profile: {
        type: Object,
        optional: false,
        blackbox: true
    }
});
User.attachSchema(UserProfileSchema);