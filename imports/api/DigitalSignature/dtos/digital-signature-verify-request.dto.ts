import { IsNotEmpty, IsString } from 'class-validator';
import { RequestDto } from '/imports/common/dtos/request.dto';

export class DigitalSignatureVerifyRequestDto extends RequestDto {
    @IsString()
    @IsNotEmpty()
    publicKeyBase64: string;

    @IsString()
    @IsNotEmpty()
    signatureBase64: string;

    @IsString()
    @IsNotEmpty()
    documentBase64: string;
}
