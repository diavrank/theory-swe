import crypto from 'crypto';
import { DigitalSignatureSignRequestDto } from './dtos/digital-signature-sign-request.dto';
import { DigitalSignatureVerifyRequestDto } from './dtos/digital-signature-verify-request.dto';
import { Injectable } from 'meteorjs-decorators';

@Injectable()
export class DigitalSignatureService {
    async signDocument(requestDto: DigitalSignatureSignRequestDto): Promise<string> {
        const privateKeyPayload = requestDto.privateKeyBase64.split(';base64,').pop() || '';
        const privateKey = Buffer.from(privateKeyPayload, 'base64').toString('utf8');

        const documentPayload = requestDto.documentBase64.split(';base64,').pop() || '';
        const document = Buffer.from(documentPayload, 'base64');

        const signer = crypto.createSign('RSA-SHA256');
        signer.write(document);
        signer.end();

        // Follow instructions on the View to generate properly the keys.
        return signer.sign(privateKey, 'base64');
    }

    async verifySignature(requestDto: DigitalSignatureVerifyRequestDto): Promise<boolean> {
        const publicKeyPayload = requestDto.publicKeyBase64.split(';base64,').pop() || '';
        const publicKey = Buffer.from(publicKeyPayload, 'base64').toString('utf8');

        const signature = requestDto.signatureBase64;

        const documentPayload = requestDto.documentBase64.split(';base64,').pop() || '';
        const document = Buffer.from(documentPayload, 'base64');

        const verifier = crypto.createVerify('RSA-SHA256');
        verifier.write(document);
        verifier.end();

        return verifier.verify(publicKey, signature, 'base64');
    }
}
