// @ts-ignore
const { Async } = global;
/**
 * Function to convert async functions to sync functions
 * @param promise Async function invocation (promise)
 * @returns {*}
 */
export default (promise: Promise<any>) => {
	const { result, error } = Async.runSync((done: Function) =>
		Promise.resolve(promise).then(
			success => done(null, success),
			error => done(error)
		));
	if (error) {
		throw error;
	} else {
		return result;
	}
}