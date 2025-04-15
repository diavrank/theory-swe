import { ProfilesModule } from './Profiles/profiles.module';
import { UsersModule } from './Users/users.module';
import { Module } from '/imports/common/utils/module';

@Module({
    imports: [
        UsersModule,
        ProfilesModule
    ]
})
export class AppModule {} 