declare module 'meteor/peerlibrary:middleware' {
	export {};

	export class PublishEndpoint {
		constructor(name: string | null, func: (this: import('meteor/meteor').Subscription, ...args: any[]) => void, options?: { is_auto: boolean });
		use: Function;
	}
}
