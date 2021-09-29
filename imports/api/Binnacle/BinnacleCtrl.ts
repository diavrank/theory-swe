import { Meteor } from 'meteor/meteor';
import { ResponseMessage } from '../../startup/server/utils/ResponseMessage';

// @ts-ignore
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import FileOperations from '../../startup/server/utils/FileOperations';
import Utilities from '../../startup/server/utils/helpers';

export const binnacleMakeBackupMethod = new ValidatedMethod({
	name: 'binnacle.makeBackup',
	validate: null,
	async run() {
		const responseMessage = new ResponseMessage();
		try {
			const binnacleName = 'binnacle-' + Utilities.lastLocalISODate();
			const responseFile = await FileOperations.binnacleExist(binnacleName);
			if (responseFile.data.success) {
				const binnacleData = await FileOperations.getBinnacleBuffer(binnacleName);
				const response = await FileOperations.saveBinnacleFromBufferToGoogleStorage(binnacleData.data.bufferData, binnacleName);
				responseMessage.create('Binnacle backup successfully performed', undefined, response);
			} else {
				responseMessage.create('No binnacle for the previous day');
			}
		} catch (exception) {
			console.error('binnacle.makeBackup: ', exception);
			throw new Meteor.Error('500', 'An error occurred while doing binnacle backup');
		}
		return responseMessage;
	}
});
