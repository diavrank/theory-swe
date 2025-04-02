import { Mongo } from "meteor/mongo";
import type { User } from "./user.entity";

export const UserCollection = new Mongo.Collection<User>('users');