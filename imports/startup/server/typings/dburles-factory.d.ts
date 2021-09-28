declare module 'meteor/dburles:factory' {
	import { Mongo } from 'meteor/mongo';

	export class FactoryObject<T> {
		after(fn : (doc : T) => void) : FactoryObject<T>;
	}

	export class Factory {
		static define<T>(name : string, collection: Mongo.Collection<T>, doc : any) : FactoryObject<T>;
		static get<T>(name : string) : Object;
		static build<T>(name : string, doc? : T) : void;
		static tree<T>(name : string, doc? : T) : T;
		static create(name: string, doc? : any) : Object;
		static extend<T>(name: string, doc? : T) : Object;
	}
}
