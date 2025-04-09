// Global API configuration
// @ts-ignore
import MakaRest from 'meteor/maka:rest';
import './upload-middleware';

// TODO: Implement Expressjs API
const Api = new MakaRest({
    useDefaultAuth: true,
    prettyJson: true,
    isRoot: true
});

export default Api;
