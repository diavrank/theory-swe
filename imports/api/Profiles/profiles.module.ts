import { UserService } from '../Users/users.service';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { forwardRef } from '/imports/common/utils/forward-ref';
import { Module } from '/imports/common/utils/module';

@Module({
    controllers: [
        ProfilesController
    ],
    providers: [
        ProfilesService,
        forwardRef(() => UserService)
    ]
})
export class ProfilesModule {} 