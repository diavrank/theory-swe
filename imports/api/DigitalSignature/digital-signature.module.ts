import { DigitalSignatureController } from './digital-signature.controller';
import { DigitalSignatureService } from './digital-signature.service';
import { Module } from 'meteorjs-decorators';

@Module({
    controllers: [
        DigitalSignatureController
    ],
    providers: [
        DigitalSignatureService
    ]
})
export class DigitalSignatureModule {}
