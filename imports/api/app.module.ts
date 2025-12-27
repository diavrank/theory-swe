import { AuthModule } from './Authentication/auth.module';
import { DigitalSignatureModule } from './DigitalSignature/digital-signature.module';
import { PermissionsModule } from './Permissions/permissions.module';
import { ProfilesModule } from './Profiles/profiles.module';
import { UsersModule } from './Users/users.module';
import { Module } from 'meteorjs-decorators';

@Module({
    imports: [
        UsersModule,
        ProfilesModule,
        PermissionsModule,
        DigitalSignatureModule,
        AuthModule
    ]
})
export class AppModule {} 
