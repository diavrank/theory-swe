import { ValidatedMethod } from 'meteor/mdg:validated-method';
import AuthGuard from '@middlewares/AuthGuard';
import { Meteor } from 'meteor/meteor';
import { ResponseMessage } from '@server/utils/ResponseMessage';
import { DigitalSignatureService } from '/imports/api/DigitalSignature/DigitalSignatureServ';
import { DigitalSignatureSignRequestDto } from '/imports/api/DigitalSignature/dtos/DigitalSignatureSignRequest.dto';
import Permissions from '@server/Permissions';
import { DigitalSignatureVerifyRequestDto } from '@api/DigitalSignature/dtos/DigitalSignatureVerifyRequest.dto';

const digitalSignatureService = new DigitalSignatureService();

export const signDocumentMethod = new ValidatedMethod({
    name: 'digitalSignature.sign',
    mixins: [MethodHooks],
    permissions: [Permissions.DIGITAL_SIGNATURE.SIGN.VALUE],
    beforeHooks: [AuthGuard.checkPermission],
    validate(requestDto: DigitalSignatureSignRequestDto) {
        new DigitalSignatureSignRequestDto(requestDto).validate(this);
    },
    async run(requestDto: DigitalSignatureSignRequestDto) {
        const responseMessage = new ResponseMessage();
        try {
            const signature =
                await digitalSignatureService.signDocument(requestDto);
            responseMessage.create(
                'Signing successfully!',
                undefined,
                signature,
            );
        } catch (exception) {
            console.error(`${this.name}: `, exception);
            throw new Meteor.Error(
                '500',
                'An error occurred while signing the document',
            );
        }
        return responseMessage;
    },
});

export const verifySignatureMethod = new ValidatedMethod({
    name: 'digitalSignature.verify',
    mixins: [MethodHooks],
    permissions: [Permissions.DIGITAL_SIGNATURE.VERIFY.VALUE],
    beforeHooks: [AuthGuard.checkPermission],
    validate(requestDto: DigitalSignatureVerifyRequestDto) {
        new DigitalSignatureVerifyRequestDto(requestDto).validate(this);
    },
    async run(requestDto: DigitalSignatureVerifyRequestDto) {
        const responseMessage = new ResponseMessage();
        try {
            const result =
                await digitalSignatureService.verifySignature(requestDto);
            responseMessage.create('Result of verification', undefined, result);
        } catch (exception) {
            console.error(`${this.name}: `, exception);
            throw new Meteor.Error(
                '500',
                'An error occurred while verifying the signature',
            );
        }
        return responseMessage;
    },
});
