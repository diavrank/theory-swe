import { DigitalSignatureSignRequestDto } from '/imports/api/DigitalSignature/dtos/DigitalSignatureSignRequest.dto';
import crypto from 'crypto';
import { DigitalSignatureVerifyRequestDto } from '@api/DigitalSignature/dtos/DigitalSignatureVerifyRequest.dto';

export class DigitalSignatureService {
    async signDocument(
        requestDto: DigitalSignatureSignRequestDto,
    ): Promise<string> {
        const base64EncodedPrivateKeyString = requestDto
            .privateKeyBase64!.split(';base64,')
            .pop() as string;
        const privateKey = Buffer.from(
            base64EncodedPrivateKeyString,
            'base64',
        ).toString('utf8');

        const base64EncodedDocumentString = requestDto
            .documentBase64!.split(';base64,')
            .pop() as string;

        const document = Buffer.from(base64EncodedDocumentString, 'base64');

        const signer = crypto.createSign('RSA-SHA256');
        signer.write(document);
        signer.end();

        return signer.sign(privateKey, 'base64');
    }

    async verifySignature(
        requestDto: DigitalSignatureVerifyRequestDto,
    ): Promise<boolean> {
        const base64EncodedPrivateKeyString = requestDto
            .publicKeyBase64!.split(';base64,')
            .pop() as string;
        const publicKey = Buffer.from(
            base64EncodedPrivateKeyString,
            'base64',
        ).toString('utf8');

        const signature = requestDto.signatureBase64!; // this is already the content

        const base64EncodedDocumentString = requestDto
            .documentBase64!.split(';base64,')
            .pop() as string;
        const document = Buffer.from(base64EncodedDocumentString, 'base64');

        const verifier = crypto.createVerify('RSA-SHA256');
        verifier.write(document);
        verifier.end();

        return verifier.verify(publicKey, signature, 'base64');
    }
}
