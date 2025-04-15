import { ProfilesService } from '../Profiles/profiles.service';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { forwardRef } from '/imports/common/utils/forward-ref';
import { Module } from '/imports/common/utils/module';

@Module({
    controllers: [
        UsersController
    ],
    providers: [
        UserService,
        forwardRef(() => ProfilesService)
    ]
})
export class UsersModule {} 