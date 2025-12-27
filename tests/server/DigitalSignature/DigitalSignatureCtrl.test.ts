import chai from 'chai';
import crypto from 'crypto';
import { Roles } from 'meteor/alanning:roles';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/jessedev:cleaner';
import { Meteor } from 'meteor/meteor';
import Permissions from '../../../imports/api/Permissions/helpers/permissions.helpers';
import { StaticProfiles } from '../../../imports/api/Profiles/constants/static-profiles.constant';
import '/imports/api/app.module';

describe('DigitalSignatureCtrl', function () {
	let user: Meteor.User;
	let signMethod: any;
	let verifyMethod: any;
	let privateKeyBase64: string;
	let publicKeyBase64: string;
	let documentBase64: string;

	before(async function () {
		resetDatabase({ excludedCollections: ['roles', 'role-assignment', 'profiles'] });
		user = await Factory.createAsync<Meteor.User>('user');
		signMethod = Meteor.server.method_handlers['digitalSignature.sign'];
		verifyMethod = Meteor.server.method_handlers['digitalSignature.verify'];
		await Roles.setUserRolesAsync(user._id, [
			Permissions.DIGITAL_SIGNATURE.SIGN.VALUE,
			Permissions.DIGITAL_SIGNATURE.VERIFY.VALUE
		], StaticProfiles.admin.name);

		const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
		privateKeyBase64 = `data:application/x-pem-file;base64,${Buffer.from(privateKey.export({ type: 'pkcs1', format: 'pem' })).toString('base64')}`;
		publicKeyBase64 = `data:application/x-pem-file;base64,${Buffer.from(publicKey.export({ type: 'spki', format: 'pem' })).toString('base64')}`;
		documentBase64 = `data:text/plain;base64,${Buffer.from('Document to sign').toString('base64')}`;
	});

	it('Signs a document', async function () {
		const response = await signMethod.apply({ userId: user._id }, [{
			privateKeyBase64,
			documentBase64
		}]);

		chai.assert.equal(response.message, 'Signing successfully!');
		chai.assert.isString(response.data);
		chai.assert.isAbove(response.data.length, 0);
	});

	it('Verifies a signed document', async function () {
		const signResponse = await signMethod.apply({ userId: user._id }, [{
			privateKeyBase64,
			documentBase64
		}]);

		const verifyResponse = await verifyMethod.apply({ userId: user._id }, [{
			publicKeyBase64,
			signatureBase64: signResponse.data,
			documentBase64
		}]);

		chai.assert.equal(verifyResponse.message, 'Result of verification');
		chai.assert.isTrue(verifyResponse.data);
	});
});
