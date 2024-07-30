import { Meteor } from 'meteor/meteor';
import Utilities from '../startup/server/utils/helpers';

enum BINNACLE_TYPE {
	checkIn = 'checkIn',
	checkOut = 'checkOut'
};

const BINNACLE_HEADERS = [
	'ConnectionId',
	'Time',
	'MethodName',
	'UserId',
	'UserName',
	'UserProfile',
	'ResponseEndPoint',
	'Type'
];

const LINE_BREAK = '\r\n';

const getBinnacleContent = (methodInvokation: any, user: Meteor.User | null, binnacleType: BINNACLE_TYPE) => {
	return methodInvokation.connection.id + ','
		+ Utilities.currentStringTime() + ','
		+ methodInvokation.name + ','
		+ (user ? user._id : 'unknown') + ','
		+ (user ? user.profile.name : 'unknown') + ','
		+ (user ? user.profile.profile : 'unknown') + ','
		+ binnacleType
		+ LINE_BREAK;
};

const checkIn: (this: Meteor.MethodThisType, ...args: any[]) => any = function(methodArgs: any): any {
	if (Meteor.isTest || Meteor.isAppTest) {
		return methodArgs;
	}
	const user = Meteor.user();
	let content = '';
	content += getBinnacleContent(this, user, BINNACLE_TYPE.checkIn);
	console.log(content); // TODO: Implement Datadog
	return methodArgs;
};

const checkOut: (this: Meteor.MethodThisType, ...args: any[]) => any = function(_methodArgs: any, returnValue: any): any {
	if (Meteor.isTest || Meteor.isAppTest) {
		return returnValue;
	}
	const user = Meteor.user();
	let content = '';
	content += getBinnacleContent(this, user, BINNACLE_TYPE.checkOut);
	console.log(content); // TODO: Implement Datadog
	return returnValue;
};

export default { checkIn, checkOut };
