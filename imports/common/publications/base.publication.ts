import { Subscription } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export abstract class BasePublication {
	public __context: Subscription;

	abstract init(...args: any[]): Mongo.Cursor<any>;
}
