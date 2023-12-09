import { check } from 'meteor/check';
import MethodInvocation = DDPCommon.MethodInvocation;
import { RequestDto } from '/imports/common/dtos/RequestDto.dto';

export class DigitalSignatureSignRequestDto extends RequestDto {
    privateKeyBase64: string | undefined;
    documentBase64: string | undefined;

    constructor(requestDto: DigitalSignatureSignRequestDto) {
        super();
        this.build(requestDto);
    }

    validate(methodInvocation: MethodInvocation) {
        this.send(methodInvocation, () => {
            check(this.privateKeyBase64, String);
            check(this.documentBase64, String);
        });
    }
}
