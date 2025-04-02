import { Meteor } from "meteor/meteor";

export class BaseController {
    protected __context: Meteor.MethodThisType;
}