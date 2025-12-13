import { Meteor } from 'meteor/meteor';
import Permissions from '../Permissions/helpers/permissions.helpers';
import { DigitalSignatureService } from './digital-signature.service';
import { DigitalSignatureSignRequestDto } from './dtos/digital-signature-sign-request.dto';
import { DigitalSignatureVerifyRequestDto } from './dtos/digital-signature-verify-request.dto';
import { BaseController } from '/imports/common/controllers/base.controller';
import { Controller } from '/imports/common/decorators/controller.decorator';
import { Method } from '/imports/common/decorators/method.decorator';
import { CheckPermissions } from '/imports/common/decorators/permissions.decorator';
import { Validate } from '/imports/common/decorators/validate.decorator';
import { ResponseMessage } from '/imports/startup/server/utils/ResponseMessage';

@Controller()
export class DigitalSignatureController extends BaseController {
    constructor(private readonly digitalSignatureService: DigitalSignatureService) {
        super();
    }

    @Method('digitalSignature.sign')
    @CheckPermissions(Permissions.DIGITAL_SIGNATURE.SIGN.VALUE)
    @Validate(DigitalSignatureSignRequestDto)
    async signDocument(requestDto: DigitalSignatureSignRequestDto) {
        const responseMessage = new ResponseMessage();
        try {
            const signature = await this.digitalSignatureService.signDocument(requestDto);
            responseMessage.create('Signing successfully!', undefined, signature);
        } catch (exception) {
            console.error('digitalSignature.sign: ', exception);
            throw new Meteor.Error('500', 'An error occurred while signing the document');
        }
        return responseMessage;
    }

    @Method('digitalSignature.verify')
    @CheckPermissions(Permissions.DIGITAL_SIGNATURE.VERIFY.VALUE)
    @Validate(DigitalSignatureVerifyRequestDto)
    async verifySignature(requestDto: DigitalSignatureVerifyRequestDto) {
        const responseMessage = new ResponseMessage();
        try {
            const result = await this.digitalSignatureService.verifySignature(requestDto);
            responseMessage.create('Result of verification', undefined, result);
        } catch (exception) {
            console.error('digitalSignature.verify: ', exception);
            throw new Meteor.Error('500', 'An error occurred while verifying the signature');
        }
        return responseMessage;
    }
}
