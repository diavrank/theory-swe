import { Meteor } from 'meteor/meteor';
import Utilities from '../startup/server/utils/helpers';
import FileOperations from '../startup/server/utils/FileOperations';
import SyncPromise from '../startup/server/utils/SyncPromise';

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

const getBinnacleName = () => {
	return 'binnacle-' + Utilities.currentLocalISODate();
};

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
	const fileName = getBinnacleName();
	const responseFile = SyncPromise(FileOperations.binnacleExist(fileName));
	let content = '';
	if (responseFile.data.success === false) {
		content = BINNACLE_HEADERS.join() + LINE_BREAK;
	}
	content += getBinnacleContent(this, user, BINNACLE_TYPE.checkIn);
	SyncPromise(FileOperations.saveBinnacle(content, fileName, responseFile.data.success));
	return methodArgs;
};

const checkOut: (this: Meteor.MethodThisType, ...args: any[]) => any = function(_methodArgs: any, returnValue: any): any {
	if (Meteor.isTest || Meteor.isAppTest) {
		return returnValue;
	}
	const user = Meteor.user();
	const fileName = getBinnacleName();
	const responseFile = SyncPromise(FileOperations.binnacleExist(fileName));
	let content = '';
	if (responseFile.data.success === false) {
		content = BINNACLE_HEADERS.join() + LINE_BREAK;
	}
	content += getBinnacleContent(this, user, BINNACLE_TYPE.checkOut);
	SyncPromise(FileOperations.saveBinnacle(content, fileName, responseFile.data.success));
	return returnValue;
};

export default { checkIn, checkOut };
