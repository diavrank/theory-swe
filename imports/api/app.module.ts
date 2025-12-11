import { ProfilesModule } from './Profiles/profiles.module';
import { UsersModule } from './Users/users.module';
import { PermissionsModule } from './Permissions/permissions.module';
import { Module } from '/imports/common/utils/module';

@Module({
    imports: [
        UsersModule,
        ProfilesModule,
        PermissionsModule
    ]
})
export class AppModule {} 
