import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Module } from '/imports/common/utils/module';

@Module({
    controllers: [
        AuthController
    ],
    providers: [
        AuthService
    ]
})
export class AuthModule {}
