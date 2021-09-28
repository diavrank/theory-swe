import { Meteor } from 'meteor/meteor';
import { MongoInternals } from 'meteor/mongo';
import { ClientSession } from 'mongodb';

// utility async function to wrap async raw mongo operations with a transaction
const runAsync = async(asyncRawMongoOperations: (arg0: ClientSession) => any) => {

	// setup a transaction
	const { client } = MongoInternals.defaultRemoteCollectionDriver().mongo;
	const session = await client.startSession();
	await session.startTransaction();
	try {
		// running the async operations
		let result = await asyncRawMongoOperations(session);
		await session.commitTransaction();
		// transaction committed - return value to the client
		return result;
	} catch (err: any) {
		await session.abortTransaction();
		console.error(err);
		// transaction aborted - report error to the client
		throw new Meteor.Error('Database Transaction Failed', err.message);
	} finally {
		session.endSession();
	}
};

export default { runAsync };
