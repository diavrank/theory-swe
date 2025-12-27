import { IsNotEmpty, IsString } from 'class-validator';
import { RequestDto } from 'meteorjs-decorators';

export class DigitalSignatureSignRequestDto extends RequestDto {
    @IsString()
    @IsNotEmpty()
    privateKeyBase64: string;

    @IsString()
    @IsNotEmpty()
    documentBase64: string;
}
