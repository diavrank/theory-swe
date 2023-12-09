import { check } from 'meteor/check';
import MethodInvocation = DDPCommon.MethodInvocation;
import { RequestDto } from '/imports/common/dtos/RequestDto.dto';

export class DigitalSignatureVerifyRequestDto extends RequestDto {
    publicKeyBase64: string | undefined;
    signatureBase64: string | undefined;
    documentBase64: string | undefined;

    constructor(requestDto: DigitalSignatureVerifyRequestDto) {
        super();
        this.build(requestDto);
    }

    validate(methodInvocation: MethodInvocation) {
        this.send(methodInvocation, () => {
            check(this.publicKeyBase64, String);
            check(this.signatureBase64, String);
            check(this.documentBase64, String);
        });
    }
}
