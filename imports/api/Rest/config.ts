// Global API configuration
// @ts-ignore
import { Restivus } from 'meteor/maka:rest';
import './upload-middleware';

const Api = new Restivus({
	version: 'v1',
	useDefaultAuth: true,
	prettyJson: true
});

export default Api;
