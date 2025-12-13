import { AuthModule } from './Authentication/auth.module';
import { DigitalSignatureModule } from './DigitalSignature/digital-signature.module';
import { PermissionsModule } from './Permissions/permissions.module';
import { ProfilesModule } from './Profiles/profiles.module';
import { UsersModule } from './Users/users.module';
import { Module } from '/imports/common/utils/module';

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
