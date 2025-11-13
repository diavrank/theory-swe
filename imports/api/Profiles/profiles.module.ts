import { UsersModule } from '../Users/users.module';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { forwardRef } from '/imports/common/utils/forward-ref';
import { Module } from '/imports/common/utils/module';

@Module({
    imports: [
        forwardRef(() => UsersModule)
    ],
    controllers: [
        ProfilesController
    ],
    providers: [
        ProfilesService
    ]
})
export class ProfilesModule { } 