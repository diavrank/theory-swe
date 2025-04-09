import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import type { User } from "./user.entity";

export const UserCollection = Meteor.users as Mongo.Collection<User>;