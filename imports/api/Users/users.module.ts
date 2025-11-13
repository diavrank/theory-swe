import { ProfilesModule } from '../Profiles/profiles.module';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { forwardRef } from '/imports/common/utils/forward-ref';
import { Module } from '/imports/common/utils/module';

@Module({
    imports: [
        forwardRef(() => ProfilesModule)
    ],
    controllers: [
        UsersController
    ],
    providers: [
        UserService
    ]
})
export class UsersModule {} 