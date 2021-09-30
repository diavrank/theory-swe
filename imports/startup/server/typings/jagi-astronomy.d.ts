declare module 'meteor/jagi:astronomy' {
	interface AstronomyEvent<T> {
		cancelable: boolean;
		propagates: boolean;
		doc: MeteorAstronomy.Model<T>,
		stopOnFirstError: boolean;
		fields: string[];
		simulation: boolean;
		forceUpdate: any;
		trusted: boolean;
		oldDoc: MeteorAstronomy.Model<T>;
		type: string;
		timeStamp: number;
		target: MeteorAstronomy.Model<T>;
		currentTarget: MeteorAstronomy.Model<T>;
		defaultPrevented: boolean;
		propagationStopped: boolean;
		immediatePropagationStopped: boolean;
	}
}
