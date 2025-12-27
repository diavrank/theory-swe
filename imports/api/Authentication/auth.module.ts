import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Module } from 'meteorjs-decorators';

@Module({
    controllers: [
        AuthController
    ],
    providers: [
        AuthService
    ]
})
export class AuthModule {}
