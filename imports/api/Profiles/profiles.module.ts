import { UsersModule } from '../Users/users.module';
import { SystemOptionsController } from './controllers/system-options.controller';
import { ProfilesController } from './profiles.controller';
import { ProfilesPublication } from './profiles.publication';
import { ProfilesService } from './profiles.service';
import { SystemOptionsService } from './services/system-options.service';
import { forwardRef } from '/imports/common/utils/forward-ref';
import { Module } from '/imports/common/utils/module';

@Module({
    imports: [
        forwardRef(() => UsersModule)
    ],
    controllers: [
        ProfilesController,
        SystemOptionsController,
        ProfilesPublication
    ],
    providers: [
        ProfilesService,
        SystemOptionsService
    ]
})
export class ProfilesModule { } 
