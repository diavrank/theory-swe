import { Module, forwardRef } from 'meteorjs-decorators';
import { UsersModule } from '../Users/users.module';
import { SystemOptionsController } from './controllers/system-options.controller';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { SystemOptionsService } from './services/system-options.service';

@Module({
    imports: [
        forwardRef(() => UsersModule)
    ],
    controllers: [
        ProfilesController,
        SystemOptionsController
    ],
    providers: [
        ProfilesService,
        SystemOptionsService
    ]
})
export class ProfilesModule { } 
